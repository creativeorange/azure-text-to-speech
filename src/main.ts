import {
    SpeakerAudioDestination,
    AudioConfig,
    SpeechConfig,
    SpeechSynthesizer,
    SpeechSynthesisOutputFormat,
} from 'microsoft-cognitiveservices-speech-sdk';

export default class TextToSpeech {
    key: string;
    region: string;
    voice: string;

    textToRead: string = '';

    wordBoundryList: any[] = [];

    clickedNode: any;
    highlightDiv: any;

    speechConfig: any;
    audioConfig: any;
    player: any;
    synthesizer: any;

    previousWordBoundary: any;

    interval: any;

    wordEncounters: number[] = [];
    originalHighlightDivInnerHTML: string = '';
    currentWord: string = '';
    currentOffset: number = 0;


    constructor(key: string, region: string, voice: string) {
        this.key = key;
        this.region = region;
        this.voice = voice;
    }

    async start() {
        await this.registerBindings(document);
    }

    async registerBindings(node: any) {
        const nodes = node.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i]) {
                continue;
            }

            const currentNode = nodes[i];

            if (currentNode.attributes) {
                if (currentNode.attributes.getNamedItem('co-tts.id')) {
                    await this.handleIdModifier(currentNode, currentNode.attributes.getNamedItem('co-tts.id'));
                } else if (currentNode.attributes.getNamedItem('co-tts.ajax')) {
                    await this.handleAjaxModifier(currentNode, currentNode.attributes.getNamedItem('co-tts.ajax'));
                } else if (currentNode.attributes.getNamedItem('co-tts')) {
                    await this.handleDefault(currentNode, currentNode.attributes.getNamedItem('co-tts'));
                } else if (currentNode.attributes.getNamedItem('co-tts.stop')) {
                    await this.handleStopModifier(currentNode, currentNode.attributes.getNamedItem('co-tts.stop'));
                } else if (currentNode.attributes.getNamedItem('co-tts.resume')) {
                    await this.handleResumeModifier(currentNode, currentNode.attributes.getNamedItem('co-tts.resume'));
                } else if (currentNode.attributes.getNamedItem('co-tts.pause')) {
                    await this.handlePauseModifier(currentNode, currentNode.attributes.getNamedItem('co-tts.pause'));
                }
            }

            if (currentNode.childNodes.length > 0) {
                await this.registerBindings(currentNode);
            }
        }
    }

    async handleIdModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            this.stopPlayer();
            await this.createInterval();
            this.clickedNode = node;
            const referenceDiv = document.getElementById(attr.value);

            if (!referenceDiv) {
                return;
            }

            if (referenceDiv.hasAttribute('co-tts.text') && referenceDiv.getAttribute('co-tts.text') !== '') {
                this.textToRead = referenceDiv.getAttribute('co-tts.text') ?? '';
            } else {
                this.textToRead = referenceDiv.innerHTML;
            }

            if (referenceDiv.hasAttribute('co-tts.highlight')) {
                this.highlightDiv = referenceDiv;
                this.originalHighlightDivInnerHTML = referenceDiv.innerHTML;
            }

            this.startSynthesizer(node, attr);
        });
    }

    async handleAjaxModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            this.stopPlayer();
            await this.createInterval();
            this.clickedNode = node;
            const response = await fetch(attr.value, {
                method: `GET`,
            });

            this.textToRead = await response.text();

            this.startSynthesizer(node, attr);
        });
    }

    async handleDefault(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            this.stopPlayer();
            await this.createInterval();
            this.clickedNode = node;
            if (node.hasAttribute('co-tts.highlight')) {
                this.highlightDiv = node;
                this.originalHighlightDivInnerHTML = node.innerHTML;
            }
            if (attr.value === '') {
                this.textToRead = node.innerHTML;
            } else {
                this.textToRead = attr.value;
            }

            this.startSynthesizer(node, attr);
        });
    }

    async handleWithoutClick(node: any, attr: Attr) {
        this.stopPlayer();
        await this.createInterval();
        this.clickedNode = node;
        if (node.hasAttribute('co-tts.highlight')) {
            this.highlightDiv = node;
            this.originalHighlightDivInnerHTML = node.innerHTML;
        }
        if (attr.value === '') {
            this.textToRead = node.innerHTML;
        } else {
            this.textToRead = attr.value;
        }

        this.startSynthesizer(node, attr);
    }

    async handleStopModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.stopPlayer();
            document.dispatchEvent(new CustomEvent('COAzureTTSStoppedPlaying', {}));
        });
    }

    async handlePauseModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.clearInterval();
            await this.player.pause();
            document.dispatchEvent(new CustomEvent('COAzureTTSPausedPlaying', {}));
        });
    }

    async handleResumeModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.createInterval();
            await this.player.resume();
            document.dispatchEvent(new CustomEvent('COAzureTTSResumedPlaying', {}));
        });
    }

    async stopPlayer() {
        await this.clearInterval();
        if (this.highlightDiv !== undefined) {
            this.highlightDiv.innerHTML = this.originalHighlightDivInnerHTML;
        }

        this.textToRead = '';
        this.currentWord = '';
        this.originalHighlightDivInnerHTML = '';
        this.wordBoundryList = [];
        this.wordEncounters = [];
        if (this.player !== undefined) {
            this.player.pause();
        }
        this.player = undefined;
        this.highlightDiv = undefined;
    }

    async startSynthesizer(node: any, attr: Attr) {
        this.speechConfig = SpeechConfig.fromSubscription(this.key, this.region);

        this.speechConfig.speechSynthesisVoiceName = `Microsoft Server Speech Text to Speech Voice (${this.voice})`;
        this.speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;

        this.player = new SpeakerAudioDestination();

        this.audioConfig = AudioConfig.fromSpeakerOutput(this.player);
        this.synthesizer = new SpeechSynthesizer(this.speechConfig, this.audioConfig);

        this.synthesizer.wordBoundary = (s: any, e: any) => {
            this.wordBoundryList.push(e);
        };

        this.player.onAudioEnd = async () => {
            this.stopPlayer();

            if (this.clickedNode.hasAttribute('co-tts.next')) {
                const nextNode = document.getElementById(this.clickedNode.getAttribute('co-tts.next'));
                if (nextNode && nextNode.attributes.getNamedItem('co-tts.text')) {
                    this.handleWithoutClick(nextNode, nextNode.attributes.getNamedItem('co-tts.text'));
                } else if (nextNode) {
                    nextNode.dispatchEvent(new Event('click'));
                }
            } else {
                document.dispatchEvent(new CustomEvent('COAzureTTSFinishedPlaying', {}));
            }
        };

        this.player.onAudioStart = async () => {
            document.dispatchEvent(new CustomEvent('COAzureTTSStartedPlaying', {}));
        };

        this.synthesizer.speakTextAsync(this.textToRead,
            () => {
                this.synthesizer.close();
                this.synthesizer = undefined;
            },
            () => {
                this.synthesizer.close();
                this.synthesizer = undefined;
            });
    }

    async clearInterval() {
        clearInterval(this.interval);
    }

    async createInterval() {
        this.interval = setInterval(() => {
            if (this.player !== undefined && this.highlightDiv) {
                const currentTime = this.player.currentTime;
                let wordBoundary;
                for (const e of this.wordBoundryList) {
                    if (currentTime * 1000 > e.audioOffset / 10000) {
                        wordBoundary = e;
                    } else {
                        break;
                    }
                }

                if (wordBoundary !== undefined) {
                    if (~['.', ',', '!', '?', '*'].indexOf(wordBoundary.text)) {
                        wordBoundary = this.previousWordBoundary ?? undefined;
                    }

                    if (wordBoundary === undefined) {
                        this.highlightDiv.innerHTML = this.originalHighlightDivInnerHTML;
                    } else {
                        if (!this.wordEncounters[wordBoundary.text]) {
                            this.wordEncounters[wordBoundary.text] = 0;
                        }

                        if (this.currentWord !== wordBoundary.text) {
                            this.wordEncounters[wordBoundary.text]++;
                            this.currentOffset = this.getPosition(
                                this.originalHighlightDivInnerHTML,
                                wordBoundary.text,
                                this.wordEncounters[wordBoundary.text]
                            );
                            this.currentWord = wordBoundary.text;
                        }

                        this.previousWordBoundary = wordBoundary;
                        this.highlightDiv.innerHTML = this.originalHighlightDivInnerHTML.substring(0, this.currentOffset) +
                          '<mark class=\'co-tts-highlight\'>' + wordBoundary.text + '</mark>' +
                          this.originalHighlightDivInnerHTML.substring(this.currentOffset + wordBoundary.wordLength);
                    }
                } else {
                    this.highlightDiv.innerHTML = this.originalHighlightDivInnerHTML;
                }
            }
        }, 50);
    }

    getPosition(string: string, subString: string, index: number) {
        const regex = new RegExp(`\\b${subString}\\b`, 'g');
        return string.split(regex, index).join(subString).length;
    }
}
