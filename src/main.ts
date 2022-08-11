import {SpeakerAudioDestination, AudioConfig, SpeechConfig, SpeechSynthesizer} from 'microsoft-cognitiveservices-speech-sdk';

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


    constructor(key: string, region: string, voice: string) {
        this.key = key;
        this.region = region;
        this.voice = voice;
    }

    async start() {
        setInterval(() => {
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
                    if (~['.', ',', '!', '?'].indexOf(wordBoundary.text)) {
                        wordBoundary = this.previousWordBoundary ?? undefined;
                    }

                    this.previousWordBoundary = wordBoundary;
                    this.highlightDiv.innerHTML = this.textToRead.substring(0, wordBoundary.textOffset) +
                      '<span class=\'co-tts-highlight\'>' + wordBoundary.text + '</span>' +
                      this.textToRead.substring(wordBoundary.textOffset + wordBoundary.wordLength);
                } else {
                    this.highlightDiv.innerHTML = this.textToRead;
                }
            }
        }, 50);

        await this.registerBindings(document);
    }

    async synthesis() {

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
            }

            this.startSynthesizer(node, attr);
        });
    }

    async handleAjaxModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            this.stopPlayer();
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
            this.clickedNode = node;
            if (node.hasAttribute('co-tts.highlight')) {
                this.highlightDiv = node;
            }
            if (attr.value === '') {
                this.textToRead = node.innerHTML;
            } else {
                this.textToRead = attr.value;
            }

            this.startSynthesizer(node, attr);
        });
    }

    async handleStopModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.stopPlayer();
        });
    }

    async handlePauseModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.player.pause();
        });
    }

    async handleResumeModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.player.resume();
        });
    }

    async stopPlayer() {
        if (this.highlightDiv !== undefined) {
            this.highlightDiv.innerHTML = this.textToRead;
        }

        this.textToRead = '';
        this.wordBoundryList = [];
        if (this.player !== undefined) {
            this.player.pause();
        }
        this.player = undefined;
        this.highlightDiv = undefined;
    }

    async startSynthesizer(node: any, attr: Attr) {
        this.speechConfig = SpeechConfig.fromSubscription(this.key, this.region);

        this.speechConfig.speechSynthesisVoiceName = `Microsoft Server Speech Text to Speech Voice (${this.voice})`;
        this.speechConfig.speechSynthesisOutputFormat = 8;

        this.player = new SpeakerAudioDestination();

        this.audioConfig = AudioConfig.fromSpeakerOutput(this.player);
        this.synthesizer = new SpeechSynthesizer(this.speechConfig, this.audioConfig);

        this.synthesizer.wordBoundary = (s: any, e: any) => {
            this.wordBoundryList.push(e);
        };

        this.player.onAudioEnd = () => {
            this.stopPlayer();

            if (this.clickedNode.hasAttribute('co-tts.next')) {
                const nextNode = document.getElementById(this.clickedNode.getAttribute('co-tts.next'));
                if (nextNode) {
                    nextNode.dispatchEvent(new Event('click'));
                }
            }
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
}
