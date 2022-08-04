var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var ws = {};
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function validate(uuid) {
  return typeof uuid === "string" && REGEX.test(uuid);
}
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify(rnds);
}
const createGuid = () => v4();
const createNoDashGuid = () => createGuid().replace(new RegExp("-", "g"), "").toUpperCase();
var EventType;
(function(EventType2) {
  EventType2[EventType2["Debug"] = 0] = "Debug";
  EventType2[EventType2["Info"] = 1] = "Info";
  EventType2[EventType2["Warning"] = 2] = "Warning";
  EventType2[EventType2["Error"] = 3] = "Error";
  EventType2[EventType2["None"] = 4] = "None";
})(EventType || (EventType = {}));
class PlatformEvent {
  constructor(eventName, eventType) {
    this.privName = eventName;
    this.privEventId = createNoDashGuid();
    this.privEventTime = new Date().toISOString();
    this.privEventType = eventType;
    this.privMetadata = {};
  }
  get name() {
    return this.privName;
  }
  get eventId() {
    return this.privEventId;
  }
  get eventTime() {
    return this.privEventTime;
  }
  get eventType() {
    return this.privEventType;
  }
  get metadata() {
    return this.privMetadata;
  }
}
class AudioSourceEvent extends PlatformEvent {
  constructor(eventName, audioSourceId, eventType = EventType.Info) {
    super(eventName, eventType);
    this.privAudioSourceId = audioSourceId;
  }
  get audioSourceId() {
    return this.privAudioSourceId;
  }
}
class AudioSourceInitializingEvent extends AudioSourceEvent {
  constructor(audioSourceId) {
    super("AudioSourceInitializingEvent", audioSourceId);
  }
}
class AudioSourceReadyEvent extends AudioSourceEvent {
  constructor(audioSourceId) {
    super("AudioSourceReadyEvent", audioSourceId);
  }
}
class AudioSourceOffEvent extends AudioSourceEvent {
  constructor(audioSourceId) {
    super("AudioSourceOffEvent", audioSourceId);
  }
}
class AudioSourceErrorEvent extends AudioSourceEvent {
  constructor(audioSourceId, error) {
    super("AudioSourceErrorEvent", audioSourceId, EventType.Error);
    this.privError = error;
  }
  get error() {
    return this.privError;
  }
}
class AudioStreamNodeEvent extends AudioSourceEvent {
  constructor(eventName, audioSourceId, audioNodeId) {
    super(eventName, audioSourceId);
    this.privAudioNodeId = audioNodeId;
  }
  get audioNodeId() {
    return this.privAudioNodeId;
  }
}
class AudioStreamNodeAttachingEvent extends AudioStreamNodeEvent {
  constructor(audioSourceId, audioNodeId) {
    super("AudioStreamNodeAttachingEvent", audioSourceId, audioNodeId);
  }
}
class AudioStreamNodeAttachedEvent extends AudioStreamNodeEvent {
  constructor(audioSourceId, audioNodeId) {
    super("AudioStreamNodeAttachedEvent", audioSourceId, audioNodeId);
  }
}
class AudioStreamNodeDetachedEvent extends AudioStreamNodeEvent {
  constructor(audioSourceId, audioNodeId) {
    super("AudioStreamNodeDetachedEvent", audioSourceId, audioNodeId);
  }
}
class AudioStreamNodeErrorEvent extends AudioStreamNodeEvent {
  constructor(audioSourceId, audioNodeId, error) {
    super("AudioStreamNodeErrorEvent", audioSourceId, audioNodeId);
    this.privError = error;
  }
  get error() {
    return this.privError;
  }
}
class ServiceEvent extends PlatformEvent {
  constructor(eventName, jsonstring, eventType = EventType.Info) {
    super(eventName, eventType);
    this.privJsonResult = jsonstring;
  }
  get jsonString() {
    return this.privJsonResult;
  }
}
class ConnectionEvent extends PlatformEvent {
  constructor(eventName, connectionId, eventType = EventType.Info) {
    super(eventName, eventType);
    this.privConnectionId = connectionId;
  }
  get connectionId() {
    return this.privConnectionId;
  }
}
class ConnectionStartEvent extends ConnectionEvent {
  constructor(connectionId, uri, headers) {
    super("ConnectionStartEvent", connectionId);
    this.privUri = uri;
    this.privHeaders = headers;
  }
  get uri() {
    return this.privUri;
  }
  get headers() {
    return this.privHeaders;
  }
}
class ConnectionEstablishedEvent extends ConnectionEvent {
  constructor(connectionId) {
    super("ConnectionEstablishedEvent", connectionId);
  }
}
class ConnectionClosedEvent extends ConnectionEvent {
  constructor(connectionId, statusCode, reason) {
    super("ConnectionClosedEvent", connectionId, EventType.Debug);
    this.privReason = reason;
    this.privStatusCode = statusCode;
  }
  get reason() {
    return this.privReason;
  }
  get statusCode() {
    return this.privStatusCode;
  }
}
class ConnectionErrorEvent extends ConnectionEvent {
  constructor(connectionId, message, type2) {
    super("ConnectionErrorEvent", connectionId, EventType.Debug);
    this.privMessage = message;
    this.privType = type2;
  }
  get message() {
    return this.privMessage;
  }
  get type() {
    return this.privType;
  }
}
class ConnectionMessageReceivedEvent extends ConnectionEvent {
  constructor(connectionId, networkReceivedTimeISO, message) {
    super("ConnectionMessageReceivedEvent", connectionId);
    this.privNetworkReceivedTime = networkReceivedTimeISO;
    this.privMessage = message;
  }
  get networkReceivedTime() {
    return this.privNetworkReceivedTime;
  }
  get message() {
    return this.privMessage;
  }
}
class ConnectionMessageSentEvent extends ConnectionEvent {
  constructor(connectionId, networkSentTimeISO, message) {
    super("ConnectionMessageSentEvent", connectionId);
    this.privNetworkSentTime = networkSentTimeISO;
    this.privMessage = message;
  }
  get networkSentTime() {
    return this.privNetworkSentTime;
  }
  get message() {
    return this.privMessage;
  }
}
class ArgumentNullError extends Error {
  constructor(argumentName) {
    super(argumentName);
    this.name = "ArgumentNull";
    this.message = argumentName;
  }
}
class InvalidOperationError extends Error {
  constructor(error) {
    super(error);
    this.name = "InvalidOperation";
    this.message = error;
  }
}
class ObjectDisposedError extends Error {
  constructor(objectName, error) {
    super(error);
    this.name = objectName + "ObjectDisposed";
    this.message = error;
  }
}
var MessageType;
(function(MessageType2) {
  MessageType2[MessageType2["Text"] = 0] = "Text";
  MessageType2[MessageType2["Binary"] = 1] = "Binary";
})(MessageType || (MessageType = {}));
class ConnectionMessage {
  constructor(messageType, body, headers, id) {
    this.privBody = null;
    if (messageType === MessageType.Text && body && !(typeof body === "string")) {
      throw new InvalidOperationError("Payload must be a string");
    }
    if (messageType === MessageType.Binary && body && !(body instanceof ArrayBuffer)) {
      throw new InvalidOperationError("Payload must be ArrayBuffer");
    }
    this.privMessageType = messageType;
    this.privBody = body;
    this.privHeaders = headers ? headers : {};
    this.privId = id ? id : createNoDashGuid();
    switch (this.messageType) {
      case MessageType.Binary:
        this.privSize = this.binaryBody !== null ? this.binaryBody.byteLength : 0;
        break;
      case MessageType.Text:
        this.privSize = this.textBody.length;
    }
  }
  get messageType() {
    return this.privMessageType;
  }
  get headers() {
    return this.privHeaders;
  }
  get body() {
    return this.privBody;
  }
  get textBody() {
    if (this.privMessageType === MessageType.Binary) {
      throw new InvalidOperationError("Not supported for binary message");
    }
    return this.privBody;
  }
  get binaryBody() {
    if (this.privMessageType === MessageType.Text) {
      throw new InvalidOperationError("Not supported for text message");
    }
    return this.privBody;
  }
  get id() {
    return this.privId;
  }
}
class ConnectionOpenResponse {
  constructor(statusCode, reason) {
    this.privStatusCode = statusCode;
    this.privReason = reason;
  }
  get statusCode() {
    return this.privStatusCode;
  }
  get reason() {
    return this.privReason;
  }
}
class EventSource {
  constructor(metadata) {
    this.privEventListeners = {};
    this.privIsDisposed = false;
    this.privConsoleListener = void 0;
    this.privMetadata = metadata;
  }
  onEvent(event) {
    if (this.isDisposed()) {
      throw new ObjectDisposedError("EventSource");
    }
    if (this.metadata) {
      for (const paramName in this.metadata) {
        if (paramName) {
          if (event.metadata) {
            if (!event.metadata[paramName]) {
              event.metadata[paramName] = this.metadata[paramName];
            }
          }
        }
      }
    }
    for (const eventId in this.privEventListeners) {
      if (eventId && this.privEventListeners[eventId]) {
        this.privEventListeners[eventId](event);
      }
    }
  }
  attach(onEventCallback) {
    const id = createNoDashGuid();
    this.privEventListeners[id] = onEventCallback;
    return {
      detach: () => {
        delete this.privEventListeners[id];
        return Promise.resolve();
      }
    };
  }
  attachListener(listener) {
    return this.attach((e) => listener.onEvent(e));
  }
  attachConsoleListener(listener) {
    if (!!this.privConsoleListener) {
      void this.privConsoleListener.detach();
    }
    this.privConsoleListener = this.attach((e) => listener.onEvent(e));
    return this.privConsoleListener;
  }
  isDisposed() {
    return this.privIsDisposed;
  }
  dispose() {
    this.privEventListeners = null;
    this.privIsDisposed = true;
  }
  get metadata() {
    return this.privMetadata;
  }
}
class Events {
  static setEventSource(eventSource) {
    if (!eventSource) {
      throw new ArgumentNullError("eventSource");
    }
    Events.privInstance = eventSource;
  }
  static get instance() {
    return Events.privInstance;
  }
}
Events.privInstance = new EventSource();
var ConnectionState;
(function(ConnectionState2) {
  ConnectionState2[ConnectionState2["None"] = 0] = "None";
  ConnectionState2[ConnectionState2["Connected"] = 1] = "Connected";
  ConnectionState2[ConnectionState2["Connecting"] = 2] = "Connecting";
  ConnectionState2[ConnectionState2["Disconnected"] = 3] = "Disconnected";
})(ConnectionState || (ConnectionState = {}));
class List {
  constructor(list) {
    this.privSubscriptionIdCounter = 0;
    this.privAddSubscriptions = {};
    this.privRemoveSubscriptions = {};
    this.privDisposedSubscriptions = {};
    this.privDisposeReason = null;
    this.privList = [];
    if (list) {
      for (const item of list) {
        this.privList.push(item);
      }
    }
  }
  get(itemIndex) {
    this.throwIfDisposed();
    return this.privList[itemIndex];
  }
  first() {
    return this.get(0);
  }
  last() {
    return this.get(this.length() - 1);
  }
  add(item) {
    this.throwIfDisposed();
    this.insertAt(this.privList.length, item);
  }
  insertAt(index, item) {
    this.throwIfDisposed();
    if (index === 0) {
      this.privList.unshift(item);
    } else if (index === this.privList.length) {
      this.privList.push(item);
    } else {
      this.privList.splice(index, 0, item);
    }
    this.triggerSubscriptions(this.privAddSubscriptions);
  }
  removeFirst() {
    this.throwIfDisposed();
    return this.removeAt(0);
  }
  removeLast() {
    this.throwIfDisposed();
    return this.removeAt(this.length() - 1);
  }
  removeAt(index) {
    this.throwIfDisposed();
    return this.remove(index, 1)[0];
  }
  remove(index, count) {
    this.throwIfDisposed();
    const removedElements = this.privList.splice(index, count);
    this.triggerSubscriptions(this.privRemoveSubscriptions);
    return removedElements;
  }
  clear() {
    this.throwIfDisposed();
    this.remove(0, this.length());
  }
  length() {
    this.throwIfDisposed();
    return this.privList.length;
  }
  onAdded(addedCallback) {
    this.throwIfDisposed();
    const subscriptionId = this.privSubscriptionIdCounter++;
    this.privAddSubscriptions[subscriptionId] = addedCallback;
    return {
      detach: () => {
        delete this.privAddSubscriptions[subscriptionId];
        return Promise.resolve();
      }
    };
  }
  onRemoved(removedCallback) {
    this.throwIfDisposed();
    const subscriptionId = this.privSubscriptionIdCounter++;
    this.privRemoveSubscriptions[subscriptionId] = removedCallback;
    return {
      detach: () => {
        delete this.privRemoveSubscriptions[subscriptionId];
        return Promise.resolve();
      }
    };
  }
  onDisposed(disposedCallback) {
    this.throwIfDisposed();
    const subscriptionId = this.privSubscriptionIdCounter++;
    this.privDisposedSubscriptions[subscriptionId] = disposedCallback;
    return {
      detach: () => {
        delete this.privDisposedSubscriptions[subscriptionId];
        return Promise.resolve();
      }
    };
  }
  join(seperator) {
    this.throwIfDisposed();
    return this.privList.join(seperator);
  }
  toArray() {
    const cloneCopy = Array();
    this.privList.forEach((val) => {
      cloneCopy.push(val);
    });
    return cloneCopy;
  }
  any(callback) {
    this.throwIfDisposed();
    if (callback) {
      return this.where(callback).length() > 0;
    } else {
      return this.length() > 0;
    }
  }
  all(callback) {
    this.throwIfDisposed();
    return this.where(callback).length() === this.length();
  }
  forEach(callback) {
    this.throwIfDisposed();
    for (let i = 0; i < this.length(); i++) {
      callback(this.privList[i], i);
    }
  }
  select(callback) {
    this.throwIfDisposed();
    const selectList = [];
    for (let i = 0; i < this.privList.length; i++) {
      selectList.push(callback(this.privList[i], i));
    }
    return new List(selectList);
  }
  where(callback) {
    this.throwIfDisposed();
    const filteredList = new List();
    for (let i = 0; i < this.privList.length; i++) {
      if (callback(this.privList[i], i)) {
        filteredList.add(this.privList[i]);
      }
    }
    return filteredList;
  }
  orderBy(compareFn) {
    this.throwIfDisposed();
    const clonedArray = this.toArray();
    const orderedArray = clonedArray.sort(compareFn);
    return new List(orderedArray);
  }
  orderByDesc(compareFn) {
    this.throwIfDisposed();
    return this.orderBy((a, b) => compareFn(b, a));
  }
  clone() {
    this.throwIfDisposed();
    return new List(this.toArray());
  }
  concat(list) {
    this.throwIfDisposed();
    return new List(this.privList.concat(list.toArray()));
  }
  concatArray(array) {
    this.throwIfDisposed();
    return new List(this.privList.concat(array));
  }
  isDisposed() {
    return this.privList == null;
  }
  dispose(reason) {
    if (!this.isDisposed()) {
      this.privDisposeReason = reason;
      this.privList = null;
      this.privAddSubscriptions = null;
      this.privRemoveSubscriptions = null;
      this.triggerSubscriptions(this.privDisposedSubscriptions);
    }
  }
  throwIfDisposed() {
    if (this.isDisposed()) {
      throw new ObjectDisposedError("List", this.privDisposeReason);
    }
  }
  triggerSubscriptions(subscriptions) {
    if (subscriptions) {
      for (const subscriptionId in subscriptions) {
        if (subscriptionId) {
          subscriptions[subscriptionId]();
        }
      }
    }
  }
}
var PromiseState;
(function(PromiseState2) {
  PromiseState2[PromiseState2["None"] = 0] = "None";
  PromiseState2[PromiseState2["Resolved"] = 1] = "Resolved";
  PromiseState2[PromiseState2["Rejected"] = 2] = "Rejected";
})(PromiseState || (PromiseState = {}));
class Deferred {
  constructor() {
    this.resolve = (result) => {
      this.privResolve(result);
      return this;
    };
    this.reject = (error) => {
      this.privReject(error);
      return this;
    };
    this.privPromise = new Promise((resolve, reject) => {
      this.privResolve = resolve;
      this.privReject = reject;
    });
  }
  get promise() {
    return this.privPromise;
  }
}
function marshalPromiseToCallbacks(promise, cb, err) {
  promise.then((val) => {
    try {
      if (!!cb) {
        cb(val);
      }
    } catch (error) {
      if (!!err) {
        try {
          if (error instanceof Error) {
            const typedError = error;
            err(typedError.name + ": " + typedError.message);
          } else {
            err(error);
          }
        } catch (error2) {
        }
      }
    }
  }, (error) => {
    if (!!err) {
      try {
        if (error instanceof Error) {
          const typedError = error;
          err(typedError.name + ": " + typedError.message);
        } else {
          err(error);
        }
      } catch (error2) {
      }
    }
  });
}
var __awaiter$d = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var SubscriberType;
(function(SubscriberType2) {
  SubscriberType2[SubscriberType2["Dequeue"] = 0] = "Dequeue";
  SubscriberType2[SubscriberType2["Peek"] = 1] = "Peek";
})(SubscriberType || (SubscriberType = {}));
class Queue {
  constructor(list) {
    this.privPromiseStore = new List();
    this.privIsDrainInProgress = false;
    this.privIsDisposing = false;
    this.privDisposeReason = null;
    this.privList = list ? list : new List();
    this.privDetachables = [];
    this.privSubscribers = new List();
    this.privDetachables.push(this.privList.onAdded(() => this.drain()));
  }
  enqueue(item) {
    this.throwIfDispose();
    this.enqueueFromPromise(new Promise((resolve) => resolve(item)));
  }
  enqueueFromPromise(promise) {
    this.throwIfDispose();
    promise.then((val) => {
      this.privList.add(val);
    }, () => {
    });
  }
  dequeue() {
    this.throwIfDispose();
    const deferredSubscriber = new Deferred();
    if (this.privSubscribers) {
      this.privSubscribers.add({ deferral: deferredSubscriber, type: SubscriberType.Dequeue });
      this.drain();
    }
    return deferredSubscriber.promise;
  }
  peek() {
    this.throwIfDispose();
    const deferredSubscriber = new Deferred();
    const subs = this.privSubscribers;
    if (subs) {
      this.privSubscribers.add({ deferral: deferredSubscriber, type: SubscriberType.Peek });
      this.drain();
    }
    return deferredSubscriber.promise;
  }
  length() {
    this.throwIfDispose();
    return this.privList.length();
  }
  isDisposed() {
    return this.privSubscribers == null;
  }
  drainAndDispose(pendingItemProcessor, reason) {
    return __awaiter$d(this, void 0, void 0, function* () {
      if (!this.isDisposed() && !this.privIsDisposing) {
        this.privDisposeReason = reason;
        this.privIsDisposing = true;
        const subs = this.privSubscribers;
        if (subs) {
          while (subs.length() > 0) {
            const subscriber = subs.removeFirst();
            subscriber.deferral.resolve(void 0);
          }
          if (this.privSubscribers === subs) {
            this.privSubscribers = subs;
          }
        }
        for (const detachable of this.privDetachables) {
          yield detachable.detach();
        }
        if (this.privPromiseStore.length() > 0 && pendingItemProcessor) {
          const promiseArray = [];
          this.privPromiseStore.toArray().forEach((wrapper) => {
            promiseArray.push(wrapper);
          });
          return Promise.all(promiseArray).finally(() => {
            this.privSubscribers = null;
            this.privList.forEach((item) => {
              pendingItemProcessor(item);
            });
            this.privList = null;
            return;
          }).then();
        } else {
          this.privSubscribers = null;
          this.privList = null;
        }
      }
    });
  }
  dispose(reason) {
    return __awaiter$d(this, void 0, void 0, function* () {
      yield this.drainAndDispose(null, reason);
    });
  }
  drain() {
    if (!this.privIsDrainInProgress && !this.privIsDisposing) {
      this.privIsDrainInProgress = true;
      const subs = this.privSubscribers;
      const lists = this.privList;
      if (subs && lists) {
        while (lists.length() > 0 && subs.length() > 0 && !this.privIsDisposing) {
          const subscriber = subs.removeFirst();
          if (subscriber.type === SubscriberType.Peek) {
            subscriber.deferral.resolve(lists.first());
          } else {
            const dequeuedItem = lists.removeFirst();
            subscriber.deferral.resolve(dequeuedItem);
          }
        }
        if (this.privSubscribers === subs) {
          this.privSubscribers = subs;
        }
        if (this.privList === lists) {
          this.privList = lists;
        }
      }
      this.privIsDrainInProgress = false;
    }
  }
  throwIfDispose() {
    if (this.isDisposed()) {
      if (this.privDisposeReason) {
        throw new InvalidOperationError(this.privDisposeReason);
      }
      throw new ObjectDisposedError("Queue");
    } else if (this.privIsDisposing) {
      throw new InvalidOperationError("Queue disposing");
    }
  }
}
class RawWebsocketMessage {
  constructor(messageType, payload, id) {
    this.privPayload = null;
    if (!payload) {
      throw new ArgumentNullError("payload");
    }
    if (messageType === MessageType.Binary && payload.__proto__.constructor.name !== "ArrayBuffer") {
      throw new InvalidOperationError("Payload must be ArrayBuffer");
    }
    if (messageType === MessageType.Text && !(typeof payload === "string")) {
      throw new InvalidOperationError("Payload must be a string");
    }
    this.privMessageType = messageType;
    this.privPayload = payload;
    this.privId = id ? id : createNoDashGuid();
  }
  get messageType() {
    return this.privMessageType;
  }
  get payload() {
    return this.privPayload;
  }
  get textContent() {
    if (this.privMessageType === MessageType.Binary) {
      throw new InvalidOperationError("Not supported for binary message");
    }
    return this.privPayload;
  }
  get binaryContent() {
    if (this.privMessageType === MessageType.Text) {
      throw new InvalidOperationError("Not supported for text message");
    }
    return this.privPayload;
  }
  get id() {
    return this.privId;
  }
}
class RiffPcmEncoder {
  constructor(actualSampleRate, desiredSampleRate) {
    this.privActualSampleRate = actualSampleRate;
    this.privDesiredSampleRate = desiredSampleRate;
  }
  encode(actualAudioFrame) {
    const audioFrame = this.downSampleAudioFrame(actualAudioFrame, this.privActualSampleRate, this.privDesiredSampleRate);
    if (!audioFrame) {
      return null;
    }
    const audioLength = audioFrame.length * 2;
    const buffer = new ArrayBuffer(audioLength);
    const view = new DataView(buffer);
    this.floatTo16BitPCM(view, 0, audioFrame);
    return buffer;
  }
  setString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
  floatTo16BitPCM(view, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
    }
  }
  downSampleAudioFrame(srcFrame, srcRate, dstRate) {
    if (!srcFrame) {
      return null;
    }
    if (dstRate === srcRate || dstRate > srcRate) {
      return srcFrame;
    }
    const ratio = srcRate / dstRate;
    const dstLength = Math.round(srcFrame.length / ratio);
    const dstFrame = new Float32Array(dstLength);
    let srcOffset = 0;
    let dstOffset = 0;
    while (dstOffset < dstLength) {
      const nextSrcOffset = Math.round((dstOffset + 1) * ratio);
      let accum = 0;
      let count = 0;
      while (srcOffset < nextSrcOffset && srcOffset < srcFrame.length) {
        accum += srcFrame[srcOffset++];
        count++;
      }
      dstFrame[dstOffset++] = accum / count;
    }
    return dstFrame;
  }
}
var __awaiter$c = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Stream {
  constructor(streamId) {
    this.privIsWriteEnded = false;
    this.privIsReadEnded = false;
    this.privId = streamId ? streamId : createNoDashGuid();
    this.privReaderQueue = new Queue();
  }
  get isClosed() {
    return this.privIsWriteEnded;
  }
  get isReadEnded() {
    return this.privIsReadEnded;
  }
  get id() {
    return this.privId;
  }
  close() {
    if (!this.privIsWriteEnded) {
      this.writeStreamChunk({
        buffer: null,
        isEnd: true,
        timeReceived: Date.now()
      });
      this.privIsWriteEnded = true;
    }
  }
  writeStreamChunk(streamChunk) {
    this.throwIfClosed();
    if (!this.privReaderQueue.isDisposed()) {
      try {
        this.privReaderQueue.enqueue(streamChunk);
      } catch (e) {
      }
    }
  }
  read() {
    if (this.privIsReadEnded) {
      throw new InvalidOperationError("Stream read has already finished");
    }
    return this.privReaderQueue.dequeue().then((streamChunk) => __awaiter$c(this, void 0, void 0, function* () {
      if (streamChunk === void 0 || streamChunk.isEnd) {
        yield this.privReaderQueue.dispose("End of stream reached");
      }
      return streamChunk;
    }));
  }
  readEnded() {
    if (!this.privIsReadEnded) {
      this.privIsReadEnded = true;
      this.privReaderQueue = new Queue();
    }
  }
  throwIfClosed() {
    if (this.privIsWriteEnded) {
      throw new InvalidOperationError("Stream closed");
    }
  }
}
class ChunkedArrayBufferStream extends Stream {
  constructor(targetChunkSize, streamId) {
    super(streamId);
    this.privTargetChunkSize = targetChunkSize;
    this.privNextBufferReadyBytes = 0;
  }
  writeStreamChunk(chunk) {
    if (chunk.isEnd || 0 === this.privNextBufferReadyBytes && chunk.buffer.byteLength === this.privTargetChunkSize) {
      super.writeStreamChunk(chunk);
      return;
    }
    let bytesCopiedFromBuffer = 0;
    while (bytesCopiedFromBuffer < chunk.buffer.byteLength) {
      if (void 0 === this.privNextBufferToWrite) {
        this.privNextBufferToWrite = new ArrayBuffer(this.privTargetChunkSize);
        this.privNextBufferStartTime = chunk.timeReceived;
      }
      const bytesToCopy = Math.min(chunk.buffer.byteLength - bytesCopiedFromBuffer, this.privTargetChunkSize - this.privNextBufferReadyBytes);
      const targetView = new Uint8Array(this.privNextBufferToWrite);
      const sourceView = new Uint8Array(chunk.buffer.slice(bytesCopiedFromBuffer, bytesToCopy + bytesCopiedFromBuffer));
      targetView.set(sourceView, this.privNextBufferReadyBytes);
      this.privNextBufferReadyBytes += bytesToCopy;
      bytesCopiedFromBuffer += bytesToCopy;
      if (this.privNextBufferReadyBytes === this.privTargetChunkSize) {
        super.writeStreamChunk({
          buffer: this.privNextBufferToWrite,
          isEnd: false,
          timeReceived: this.privNextBufferStartTime
        });
        this.privNextBufferReadyBytes = 0;
        this.privNextBufferToWrite = void 0;
      }
    }
  }
  close() {
    if (0 !== this.privNextBufferReadyBytes && !this.isClosed) {
      super.writeStreamChunk({
        buffer: this.privNextBufferToWrite.slice(0, this.privNextBufferReadyBytes),
        isEnd: false,
        timeReceived: this.privNextBufferStartTime
      });
    }
    super.close();
  }
}
class OCSPEvent extends PlatformEvent {
  constructor(eventName, eventType, signature) {
    super(eventName, eventType);
    this.privSignature = signature;
  }
}
class OCSPMemoryCacheHitEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPMemoryCacheHitEvent", EventType.Debug, signature);
  }
}
class OCSPCacheMissEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPCacheMissEvent", EventType.Debug, signature);
  }
}
class OCSPDiskCacheHitEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPDiskCacheHitEvent", EventType.Debug, signature);
  }
}
class OCSPCacheUpdateNeededEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPCacheUpdateNeededEvent", EventType.Debug, signature);
  }
}
class OCSPMemoryCacheStoreEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPMemoryCacheStoreEvent", EventType.Debug, signature);
  }
}
class OCSPDiskCacheStoreEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPDiskCacheStoreEvent", EventType.Debug, signature);
  }
}
class OCSPCacheUpdateCompleteEvent extends OCSPEvent {
  constructor(signature) {
    super("OCSPCacheUpdateCompleteEvent", EventType.Debug, signature);
  }
}
class OCSPStapleReceivedEvent extends OCSPEvent {
  constructor() {
    super("OCSPStapleReceivedEvent", EventType.Debug, "");
  }
}
class OCSPCacheEntryExpiredEvent extends OCSPEvent {
  constructor(serialNumber, expireTime) {
    super("OCSPCacheEntryExpiredEvent", EventType.Debug, serialNumber);
    this.privExpireTime = expireTime;
  }
}
class OCSPCacheEntryNeedsRefreshEvent extends OCSPEvent {
  constructor(serialNumber, startTime, expireTime) {
    super("OCSPCacheEntryNeedsRefreshEvent", EventType.Debug, serialNumber);
    this.privExpireTime = expireTime;
    this.privStartTime = startTime;
  }
}
class OCSPCacheHitEvent extends OCSPEvent {
  constructor(serialNumber, startTime, expireTime) {
    super("OCSPCacheHitEvent", EventType.Debug, serialNumber);
    this.privExpireTime = expireTime;
    this.privExpireTimeString = new Date(expireTime).toLocaleDateString();
    this.privStartTime = startTime;
    this.privStartTimeString = new Date(startTime).toLocaleTimeString();
  }
}
class OCSPVerificationFailedEvent extends OCSPEvent {
  constructor(serialNumber, error) {
    super("OCSPVerificationFailedEvent", EventType.Debug, serialNumber);
    this.privError = error;
  }
}
class OCSPCacheFetchErrorEvent extends OCSPEvent {
  constructor(serialNumber, error) {
    super("OCSPCacheFetchErrorEvent", EventType.Debug, serialNumber);
    this.privError = error;
  }
}
class OCSPResponseRetrievedEvent extends OCSPEvent {
  constructor(serialNumber) {
    super("OCSPResponseRetrievedEvent", EventType.Debug, serialNumber);
  }
}
class OCSPCacheUpdateErrorEvent extends OCSPEvent {
  constructor(serialNumber, error) {
    super("OCSPCacheUpdateErrorEvent", EventType.Debug, serialNumber);
    this.privError = error;
  }
}
class BackgroundEvent extends PlatformEvent {
  constructor(error) {
    super("BackgroundEvent", EventType.Error);
    this.privError = error;
  }
  get error() {
    return this.privError;
  }
}
class Contracts {
  static throwIfNullOrUndefined(param, name) {
    if (param === void 0 || param === null) {
      throw new Error("throwIfNullOrUndefined:" + name);
    }
  }
  static throwIfNull(param, name) {
    if (param === null) {
      throw new Error("throwIfNull:" + name);
    }
  }
  static throwIfNullOrWhitespace(param, name) {
    Contracts.throwIfNullOrUndefined(param, name);
    if (("" + param).trim().length < 1) {
      throw new Error("throwIfNullOrWhitespace:" + name);
    }
  }
  static throwIfDisposed(isDisposed) {
    if (isDisposed) {
      throw new Error("the object is already disposed");
    }
  }
  static throwIfArrayEmptyOrWhitespace(array, name) {
    Contracts.throwIfNullOrUndefined(array, name);
    if (array.length === 0) {
      throw new Error("throwIfArrayEmptyOrWhitespace:" + name);
    }
    for (const item of array) {
      Contracts.throwIfNullOrWhitespace(item, name);
    }
  }
  static throwIfFileDoesNotExist(param, name) {
    Contracts.throwIfNullOrWhitespace(param, name);
  }
  static throwIfNotUndefined(param, name) {
    if (param !== void 0) {
      throw new Error("throwIfNotUndefined:" + name);
    }
  }
}
class HeaderNames {
}
HeaderNames.AuthKey = "Ocp-Apim-Subscription-Key";
HeaderNames.ConnectionId = "X-ConnectionId";
HeaderNames.ContentType = "Content-Type";
HeaderNames.CustomCommandsAppId = "X-CommandsAppId";
HeaderNames.Path = "Path";
HeaderNames.RequestId = "X-RequestId";
HeaderNames.RequestStreamId = "X-StreamId";
HeaderNames.RequestTimestamp = "X-Timestamp";
class AuthInfo {
  constructor(headerName, token) {
    this.privHeaderName = headerName;
    this.privToken = token;
  }
  get headerName() {
    return this.privHeaderName;
  }
  get token() {
    return this.privToken;
  }
}
class CognitiveSubscriptionKeyAuthentication {
  constructor(subscriptionKey) {
    if (!subscriptionKey) {
      throw new ArgumentNullError("subscriptionKey");
    }
    this.privAuthInfo = new AuthInfo(HeaderNames.AuthKey, subscriptionKey);
  }
  fetch(authFetchEventId) {
    return Promise.resolve(this.privAuthInfo);
  }
  fetchOnExpiry(authFetchEventId) {
    return Promise.resolve(this.privAuthInfo);
  }
}
const AuthHeader = "Authorization";
class CognitiveTokenAuthentication {
  constructor(fetchCallback, fetchOnExpiryCallback) {
    if (!fetchCallback) {
      throw new ArgumentNullError("fetchCallback");
    }
    if (!fetchOnExpiryCallback) {
      throw new ArgumentNullError("fetchOnExpiryCallback");
    }
    this.privFetchCallback = fetchCallback;
    this.privFetchOnExpiryCallback = fetchOnExpiryCallback;
  }
  fetch(authFetchEventId) {
    return this.privFetchCallback(authFetchEventId).then((token) => new AuthInfo(AuthHeader, CognitiveTokenAuthentication.privTokenPrefix + token));
  }
  fetchOnExpiry(authFetchEventId) {
    return this.privFetchOnExpiryCallback(authFetchEventId).then((token) => new AuthInfo(AuthHeader, CognitiveTokenAuthentication.privTokenPrefix + token));
  }
}
CognitiveTokenAuthentication.privTokenPrefix = "bearer ";
class AudioFileWriter {
  constructor(filename) {
    Contracts.throwIfNullOrUndefined(void 0, "\nFile System access not available, please use Push or PullAudioOutputStream");
    this.privFd = (void 0)(filename, "w");
  }
  set format(format) {
    Contracts.throwIfNotUndefined(this.privAudioFormat, "format is already set");
    this.privAudioFormat = format;
    let headerOffset = 0;
    if (this.privAudioFormat.hasHeader) {
      headerOffset = this.privAudioFormat.header.byteLength;
    }
    if (this.privFd !== void 0) {
      this.privWriteStream = (void 0)("", { fd: this.privFd, start: headerOffset, autoClose: false });
    }
  }
  write(buffer) {
    Contracts.throwIfNullOrUndefined(this.privAudioFormat, "must set format before writing.");
    if (this.privWriteStream !== void 0) {
      this.privWriteStream.write(new Uint8Array(buffer.slice(0)));
    }
  }
  close() {
    if (this.privFd !== void 0) {
      this.privWriteStream.on("finish", () => {
        if (this.privAudioFormat.hasHeader) {
          this.privAudioFormat.updateHeader(this.privWriteStream.bytesWritten);
          (void 0)(this.privFd, new Int8Array(this.privAudioFormat.header), 0, this.privAudioFormat.header.byteLength, 0);
        }
        (void 0)(this.privFd);
        this.privFd = void 0;
      });
      this.privWriteStream.end();
    }
  }
  id() {
    return this.privId;
  }
}
var AudioFormatTag;
(function(AudioFormatTag2) {
  AudioFormatTag2[AudioFormatTag2["PCM"] = 1] = "PCM";
  AudioFormatTag2[AudioFormatTag2["MuLaw"] = 2] = "MuLaw";
  AudioFormatTag2[AudioFormatTag2["Siren"] = 3] = "Siren";
  AudioFormatTag2[AudioFormatTag2["MP3"] = 4] = "MP3";
  AudioFormatTag2[AudioFormatTag2["SILKSkype"] = 5] = "SILKSkype";
  AudioFormatTag2[AudioFormatTag2["OGG_OPUS"] = 6] = "OGG_OPUS";
  AudioFormatTag2[AudioFormatTag2["WEBM_OPUS"] = 7] = "WEBM_OPUS";
  AudioFormatTag2[AudioFormatTag2["ALaw"] = 8] = "ALaw";
  AudioFormatTag2[AudioFormatTag2["FLAC"] = 9] = "FLAC";
  AudioFormatTag2[AudioFormatTag2["OPUS"] = 10] = "OPUS";
})(AudioFormatTag || (AudioFormatTag = {}));
class AudioStreamFormat {
  static getDefaultInputFormat() {
    return AudioStreamFormatImpl.getDefaultInputFormat();
  }
  static getWaveFormat(samplesPerSecond, bitsPerSample, channels, format) {
    return new AudioStreamFormatImpl(samplesPerSecond, bitsPerSample, channels, format);
  }
  static getWaveFormatPCM(samplesPerSecond, bitsPerSample, channels) {
    return new AudioStreamFormatImpl(samplesPerSecond, bitsPerSample, channels);
  }
}
class AudioStreamFormatImpl extends AudioStreamFormat {
  constructor(samplesPerSec = 16e3, bitsPerSample = 16, channels = 1, format = AudioFormatTag.PCM) {
    super();
    let isWavFormat = true;
    switch (format) {
      case AudioFormatTag.PCM:
        this.formatTag = 1;
        break;
      case AudioFormatTag.ALaw:
        this.formatTag = 6;
        break;
      case AudioFormatTag.MuLaw:
        this.formatTag = 7;
        break;
      default:
        isWavFormat = false;
    }
    this.bitsPerSample = bitsPerSample;
    this.samplesPerSec = samplesPerSec;
    this.channels = channels;
    this.avgBytesPerSec = this.samplesPerSec * this.channels * (this.bitsPerSample / 8);
    this.blockAlign = this.channels * Math.max(this.bitsPerSample, 8);
    if (isWavFormat) {
      this.privHeader = new ArrayBuffer(44);
      const view = new DataView(this.privHeader);
      this.setString(view, 0, "RIFF");
      view.setUint32(4, 0, true);
      this.setString(view, 8, "WAVEfmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, this.formatTag, true);
      view.setUint16(22, this.channels, true);
      view.setUint32(24, this.samplesPerSec, true);
      view.setUint32(28, this.avgBytesPerSec, true);
      view.setUint16(32, this.channels * (this.bitsPerSample / 8), true);
      view.setUint16(34, this.bitsPerSample, true);
      this.setString(view, 36, "data");
      view.setUint32(40, 0, true);
    }
  }
  static getDefaultInputFormat() {
    return new AudioStreamFormatImpl();
  }
  static getAudioContext(sampleRate) {
    const AudioContext2 = window.AudioContext || window.webkitAudioContext || false;
    if (!!AudioContext2) {
      if (sampleRate !== void 0 && navigator.mediaDevices.getSupportedConstraints().sampleRate) {
        return new AudioContext2({ sampleRate });
      } else {
        return new AudioContext2();
      }
    } else {
      throw new Error("Browser does not support Web Audio API (AudioContext is not available).");
    }
  }
  close() {
    return;
  }
  get header() {
    return this.privHeader;
  }
  setString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}
var __awaiter$b = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class AudioInputStream {
  constructor() {
    return;
  }
  static createPushStream(format) {
    return PushAudioInputStream.create(format);
  }
  static createPullStream(callback, format) {
    return PullAudioInputStream.create(callback, format);
  }
}
class PushAudioInputStream extends AudioInputStream {
  static create(format) {
    return new PushAudioInputStreamImpl(format);
  }
}
class PushAudioInputStreamImpl extends PushAudioInputStream {
  constructor(format) {
    super();
    if (format === void 0) {
      this.privFormat = AudioStreamFormatImpl.getDefaultInputFormat();
    } else {
      this.privFormat = format;
    }
    this.privEvents = new EventSource();
    this.privId = createNoDashGuid();
    this.privStream = new ChunkedArrayBufferStream(this.privFormat.avgBytesPerSec / 10);
  }
  get format() {
    return Promise.resolve(this.privFormat);
  }
  write(dataBuffer) {
    this.privStream.writeStreamChunk({
      buffer: dataBuffer,
      isEnd: false,
      timeReceived: Date.now()
    });
  }
  close() {
    this.privStream.close();
  }
  id() {
    return this.privId;
  }
  get blob() {
    return this.attach("id").then((audioNode) => {
      const data = [];
      let bufferData = Buffer.from("");
      const readCycle = () => audioNode.read().then((audioStreamChunk) => {
        if (!audioStreamChunk || audioStreamChunk.isEnd) {
          if (typeof XMLHttpRequest !== "undefined" && typeof Blob !== "undefined") {
            return Promise.resolve(new Blob(data));
          } else {
            return Promise.resolve(Buffer.from(bufferData));
          }
        } else {
          if (typeof Blob !== "undefined") {
            data.push(audioStreamChunk.buffer);
          } else {
            bufferData = Buffer.concat([bufferData, this.toBuffer(audioStreamChunk.buffer)]);
          }
          return readCycle();
        }
      });
      return readCycle();
    });
  }
  turnOn() {
    this.onEvent(new AudioSourceInitializingEvent(this.privId));
    this.onEvent(new AudioSourceReadyEvent(this.privId));
    return;
  }
  attach(audioNodeId) {
    return __awaiter$b(this, void 0, void 0, function* () {
      this.onEvent(new AudioStreamNodeAttachingEvent(this.privId, audioNodeId));
      yield this.turnOn();
      const stream = this.privStream;
      this.onEvent(new AudioStreamNodeAttachedEvent(this.privId, audioNodeId));
      return {
        detach: () => __awaiter$b(this, void 0, void 0, function* () {
          this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
          return this.turnOff();
        }),
        id: () => audioNodeId,
        read: () => stream.read()
      };
    });
  }
  detach(audioNodeId) {
    this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
  }
  turnOff() {
    return;
  }
  get events() {
    return this.privEvents;
  }
  get deviceInfo() {
    return Promise.resolve({
      bitspersample: this.privFormat.bitsPerSample,
      channelcount: this.privFormat.channels,
      connectivity: connectivity.Unknown,
      manufacturer: "Speech SDK",
      model: "PushStream",
      samplerate: this.privFormat.samplesPerSec,
      type: type.Stream
    });
  }
  onEvent(event) {
    this.privEvents.onEvent(event);
    Events.instance.onEvent(event);
  }
  toBuffer(arrayBuffer) {
    const buf = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
class PullAudioInputStream extends AudioInputStream {
  constructor() {
    super();
  }
  static create(callback, format) {
    return new PullAudioInputStreamImpl(callback, format);
  }
}
class PullAudioInputStreamImpl extends PullAudioInputStream {
  constructor(callback, format) {
    super();
    if (void 0 === format) {
      this.privFormat = AudioStreamFormat.getDefaultInputFormat();
    } else {
      this.privFormat = format;
    }
    this.privEvents = new EventSource();
    this.privId = createNoDashGuid();
    this.privCallback = callback;
    this.privIsClosed = false;
    this.privBufferSize = this.privFormat.avgBytesPerSec / 10;
  }
  get format() {
    return Promise.resolve(this.privFormat);
  }
  close() {
    this.privIsClosed = true;
    this.privCallback.close();
  }
  id() {
    return this.privId;
  }
  get blob() {
    return Promise.reject("Not implemented");
  }
  turnOn() {
    this.onEvent(new AudioSourceInitializingEvent(this.privId));
    this.onEvent(new AudioSourceReadyEvent(this.privId));
    return;
  }
  attach(audioNodeId) {
    return __awaiter$b(this, void 0, void 0, function* () {
      this.onEvent(new AudioStreamNodeAttachingEvent(this.privId, audioNodeId));
      yield this.turnOn();
      this.onEvent(new AudioStreamNodeAttachedEvent(this.privId, audioNodeId));
      return {
        detach: () => {
          this.privCallback.close();
          this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
          return this.turnOff();
        },
        id: () => audioNodeId,
        read: () => {
          let totalBytes = 0;
          let transmitBuff;
          while (totalBytes < this.privBufferSize) {
            const readBuff = new ArrayBuffer(this.privBufferSize - totalBytes);
            const pulledBytes = this.privCallback.read(readBuff);
            if (void 0 === transmitBuff) {
              transmitBuff = readBuff;
            } else {
              const intView = new Int8Array(transmitBuff);
              intView.set(new Int8Array(readBuff), totalBytes);
            }
            if (0 === pulledBytes) {
              break;
            }
            totalBytes += pulledBytes;
          }
          return Promise.resolve({
            buffer: transmitBuff.slice(0, totalBytes),
            isEnd: this.privIsClosed || totalBytes === 0,
            timeReceived: Date.now()
          });
        }
      };
    });
  }
  detach(audioNodeId) {
    this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
  }
  turnOff() {
    return;
  }
  get events() {
    return this.privEvents;
  }
  get deviceInfo() {
    return Promise.resolve({
      bitspersample: this.privFormat.bitsPerSample,
      channelcount: this.privFormat.channels,
      connectivity: connectivity.Unknown,
      manufacturer: "Speech SDK",
      model: "PullStream",
      samplerate: this.privFormat.samplesPerSec,
      type: type.Stream
    });
  }
  onEvent(event) {
    this.privEvents.onEvent(event);
    Events.instance.onEvent(event);
  }
}
var SpeechSynthesisOutputFormat;
(function(SpeechSynthesisOutputFormat2) {
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw8Khz8BitMonoMULaw"] = 0] = "Raw8Khz8BitMonoMULaw";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff16Khz16KbpsMonoSiren"] = 1] = "Riff16Khz16KbpsMonoSiren";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio16Khz16KbpsMonoSiren"] = 2] = "Audio16Khz16KbpsMonoSiren";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio16Khz32KBitRateMonoMp3"] = 3] = "Audio16Khz32KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio16Khz128KBitRateMonoMp3"] = 4] = "Audio16Khz128KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio16Khz64KBitRateMonoMp3"] = 5] = "Audio16Khz64KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio24Khz48KBitRateMonoMp3"] = 6] = "Audio24Khz48KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio24Khz96KBitRateMonoMp3"] = 7] = "Audio24Khz96KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio24Khz160KBitRateMonoMp3"] = 8] = "Audio24Khz160KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw16Khz16BitMonoTrueSilk"] = 9] = "Raw16Khz16BitMonoTrueSilk";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff16Khz16BitMonoPcm"] = 10] = "Riff16Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff8Khz16BitMonoPcm"] = 11] = "Riff8Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff24Khz16BitMonoPcm"] = 12] = "Riff24Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff8Khz8BitMonoMULaw"] = 13] = "Riff8Khz8BitMonoMULaw";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw16Khz16BitMonoPcm"] = 14] = "Raw16Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw24Khz16BitMonoPcm"] = 15] = "Raw24Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw8Khz16BitMonoPcm"] = 16] = "Raw8Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Ogg16Khz16BitMonoOpus"] = 17] = "Ogg16Khz16BitMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Ogg24Khz16BitMonoOpus"] = 18] = "Ogg24Khz16BitMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw48Khz16BitMonoPcm"] = 19] = "Raw48Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff48Khz16BitMonoPcm"] = 20] = "Riff48Khz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio48Khz96KBitRateMonoMp3"] = 21] = "Audio48Khz96KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio48Khz192KBitRateMonoMp3"] = 22] = "Audio48Khz192KBitRateMonoMp3";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Ogg48Khz16BitMonoOpus"] = 23] = "Ogg48Khz16BitMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Webm16Khz16BitMonoOpus"] = 24] = "Webm16Khz16BitMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Webm24Khz16BitMonoOpus"] = 25] = "Webm24Khz16BitMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw24Khz16BitMonoTrueSilk"] = 26] = "Raw24Khz16BitMonoTrueSilk";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw8Khz8BitMonoALaw"] = 27] = "Raw8Khz8BitMonoALaw";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff8Khz8BitMonoALaw"] = 28] = "Riff8Khz8BitMonoALaw";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Webm24Khz16Bit24KbpsMonoOpus"] = 29] = "Webm24Khz16Bit24KbpsMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio16Khz16Bit32KbpsMonoOpus"] = 30] = "Audio16Khz16Bit32KbpsMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio24Khz16Bit48KbpsMonoOpus"] = 31] = "Audio24Khz16Bit48KbpsMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Audio24Khz16Bit24KbpsMonoOpus"] = 32] = "Audio24Khz16Bit24KbpsMonoOpus";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw22050Hz16BitMonoPcm"] = 33] = "Raw22050Hz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff22050Hz16BitMonoPcm"] = 34] = "Riff22050Hz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Raw44100Hz16BitMonoPcm"] = 35] = "Raw44100Hz16BitMonoPcm";
  SpeechSynthesisOutputFormat2[SpeechSynthesisOutputFormat2["Riff44100Hz16BitMonoPcm"] = 36] = "Riff44100Hz16BitMonoPcm";
})(SpeechSynthesisOutputFormat || (SpeechSynthesisOutputFormat = {}));
class AudioOutputFormatImpl extends AudioStreamFormatImpl {
  constructor(formatTag, channels, samplesPerSec, avgBytesPerSec, blockAlign, bitsPerSample, audioFormatString, requestAudioFormatString, hasHeader) {
    super(samplesPerSec, bitsPerSample, channels, formatTag);
    this.formatTag = formatTag;
    this.avgBytesPerSec = avgBytesPerSec;
    this.blockAlign = blockAlign;
    this.priAudioFormatString = audioFormatString;
    this.priRequestAudioFormatString = requestAudioFormatString;
    this.priHasHeader = hasHeader;
  }
  static fromSpeechSynthesisOutputFormat(speechSynthesisOutputFormat) {
    if (speechSynthesisOutputFormat === void 0) {
      return AudioOutputFormatImpl.getDefaultOutputFormat();
    }
    return AudioOutputFormatImpl.fromSpeechSynthesisOutputFormatString(AudioOutputFormatImpl.SpeechSynthesisOutputFormatToString[speechSynthesisOutputFormat]);
  }
  static fromSpeechSynthesisOutputFormatString(speechSynthesisOutputFormatString) {
    switch (speechSynthesisOutputFormatString) {
      case "raw-8khz-8bit-mono-mulaw":
        return new AudioOutputFormatImpl(AudioFormatTag.MuLaw, 1, 8e3, 8e3, 1, 8, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "riff-16khz-16kbps-mono-siren":
        return new AudioOutputFormatImpl(AudioFormatTag.Siren, 1, 16e3, 2e3, 40, 0, speechSynthesisOutputFormatString, "audio-16khz-16kbps-mono-siren", true);
      case "audio-16khz-16kbps-mono-siren":
        return new AudioOutputFormatImpl(AudioFormatTag.Siren, 1, 16e3, 2e3, 40, 0, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-16khz-32kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 16e3, 32 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-16khz-128kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 16e3, 128 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-16khz-64kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 16e3, 64 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-24khz-48kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 24e3, 48 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-24khz-96kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 24e3, 96 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-24khz-160kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 24e3, 160 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "raw-16khz-16bit-mono-truesilk":
        return new AudioOutputFormatImpl(AudioFormatTag.SILKSkype, 1, 16e3, 32e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "riff-8khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 8e3, 16e3, 2, 16, speechSynthesisOutputFormatString, "raw-8khz-16bit-mono-pcm", true);
      case "riff-24khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 24e3, 48e3, 2, 16, speechSynthesisOutputFormatString, "raw-24khz-16bit-mono-pcm", true);
      case "riff-8khz-8bit-mono-mulaw":
        return new AudioOutputFormatImpl(AudioFormatTag.MuLaw, 1, 8e3, 8e3, 1, 8, speechSynthesisOutputFormatString, "raw-8khz-8bit-mono-mulaw", true);
      case "raw-16khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 16e3, 32e3, 2, 16, speechSynthesisOutputFormatString, "raw-16khz-16bit-mono-pcm", false);
      case "raw-24khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 24e3, 48e3, 2, 16, speechSynthesisOutputFormatString, "raw-24khz-16bit-mono-pcm", false);
      case "raw-8khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 8e3, 16e3, 2, 16, speechSynthesisOutputFormatString, "raw-8khz-16bit-mono-pcm", false);
      case "ogg-16khz-16bit-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.OGG_OPUS, 1, 16e3, 8192, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "ogg-24khz-16bit-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.OGG_OPUS, 1, 24e3, 8192, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "raw-48khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 48e3, 96e3, 2, 16, speechSynthesisOutputFormatString, "raw-48khz-16bit-mono-pcm", false);
      case "riff-48khz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 48e3, 96e3, 2, 16, speechSynthesisOutputFormatString, "raw-48khz-16bit-mono-pcm", true);
      case "audio-48khz-96kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 48e3, 96 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-48khz-192kbitrate-mono-mp3":
        return new AudioOutputFormatImpl(AudioFormatTag.MP3, 1, 48e3, 192 << 7, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "ogg-48khz-16bit-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.OGG_OPUS, 1, 48e3, 12e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "webm-16khz-16bit-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.WEBM_OPUS, 1, 16e3, 4e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "webm-24khz-16bit-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.WEBM_OPUS, 1, 24e3, 6e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "webm-24khz-16bit-24kbps-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.WEBM_OPUS, 1, 24e3, 3e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-16khz-16bit-32kbps-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.OPUS, 1, 16e3, 4e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-24khz-16bit-48kbps-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.OPUS, 1, 24e3, 6e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-24khz-16bit-24kbps-mono-opus":
        return new AudioOutputFormatImpl(AudioFormatTag.OPUS, 1, 24e3, 3e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-24khz-16bit-mono-flac":
        return new AudioOutputFormatImpl(AudioFormatTag.FLAC, 1, 24e3, 24e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "audio-48khz-16bit-mono-flac":
        return new AudioOutputFormatImpl(AudioFormatTag.FLAC, 1, 48e3, 3e4, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "raw-24khz-16bit-mono-truesilk":
        return new AudioOutputFormatImpl(AudioFormatTag.SILKSkype, 1, 24e3, 48e3, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "raw-8khz-8bit-mono-alaw":
        return new AudioOutputFormatImpl(AudioFormatTag.ALaw, 1, 8e3, 8e3, 1, 8, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "riff-8khz-8bit-mono-alaw":
        return new AudioOutputFormatImpl(AudioFormatTag.ALaw, 1, 8e3, 8e3, 1, 8, speechSynthesisOutputFormatString, "raw-8khz-8bit-mono-alaw", true);
      case "raw-22050hz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 22050, 44100, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "riff-22050hz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 22050, 44100, 2, 16, speechSynthesisOutputFormatString, "raw-22050hz-16bit-mono-pcm", true);
      case "raw-44100hz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 44100, 88200, 2, 16, speechSynthesisOutputFormatString, speechSynthesisOutputFormatString, false);
      case "riff-44100hz-16bit-mono-pcm":
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 44100, 88200, 2, 16, speechSynthesisOutputFormatString, "raw-44100hz-16bit-mono-pcm", true);
      case "riff-16khz-16bit-mono-pcm":
      default:
        return new AudioOutputFormatImpl(AudioFormatTag.PCM, 1, 16e3, 32e3, 2, 16, "riff-16khz-16bit-mono-pcm", "raw-16khz-16bit-mono-pcm", true);
    }
  }
  static getDefaultOutputFormat() {
    return AudioOutputFormatImpl.fromSpeechSynthesisOutputFormatString(typeof window !== "undefined" ? "audio-24khz-48kbitrate-mono-mp3" : "riff-16khz-16bit-mono-pcm");
  }
  get hasHeader() {
    return this.priHasHeader;
  }
  get header() {
    if (this.hasHeader) {
      return this.privHeader;
    }
    return void 0;
  }
  updateHeader(audioLength) {
    if (this.priHasHeader) {
      const view = new DataView(this.privHeader);
      view.setUint32(4, audioLength + this.privHeader.byteLength - 8, true);
      view.setUint32(40, audioLength, true);
    }
  }
  get requestAudioFormatString() {
    return this.priRequestAudioFormatString;
  }
}
AudioOutputFormatImpl.SpeechSynthesisOutputFormatToString = {
  [SpeechSynthesisOutputFormat.Raw8Khz8BitMonoMULaw]: "raw-8khz-8bit-mono-mulaw",
  [SpeechSynthesisOutputFormat.Riff16Khz16KbpsMonoSiren]: "riff-16khz-16kbps-mono-siren",
  [SpeechSynthesisOutputFormat.Audio16Khz16KbpsMonoSiren]: "audio-16khz-16kbps-mono-siren",
  [SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3]: "audio-16khz-32kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3]: "audio-16khz-128kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Audio16Khz64KBitRateMonoMp3]: "audio-16khz-64kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3]: "audio-24khz-48kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3]: "audio-24khz-96kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3]: "audio-24khz-160kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Raw16Khz16BitMonoTrueSilk]: "raw-16khz-16bit-mono-truesilk",
  [SpeechSynthesisOutputFormat.Riff16Khz16BitMonoPcm]: "riff-16khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Riff8Khz16BitMonoPcm]: "riff-8khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm]: "riff-24khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Riff8Khz8BitMonoMULaw]: "riff-8khz-8bit-mono-mulaw",
  [SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm]: "raw-16khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Raw24Khz16BitMonoPcm]: "raw-24khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Raw8Khz16BitMonoPcm]: "raw-8khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Ogg16Khz16BitMonoOpus]: "ogg-16khz-16bit-mono-opus",
  [SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus]: "ogg-24khz-16bit-mono-opus",
  [SpeechSynthesisOutputFormat.Raw48Khz16BitMonoPcm]: "raw-48khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Riff48Khz16BitMonoPcm]: "riff-48khz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Audio48Khz96KBitRateMonoMp3]: "audio-48khz-96kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3]: "audio-48khz-192kbitrate-mono-mp3",
  [SpeechSynthesisOutputFormat.Ogg48Khz16BitMonoOpus]: "ogg-48khz-16bit-mono-opus",
  [SpeechSynthesisOutputFormat.Webm16Khz16BitMonoOpus]: "webm-16khz-16bit-mono-opus",
  [SpeechSynthesisOutputFormat.Webm24Khz16BitMonoOpus]: "webm-24khz-16bit-mono-opus",
  [SpeechSynthesisOutputFormat.Webm24Khz16Bit24KbpsMonoOpus]: "webm-24khz-16bit-24kbps-mono-opus",
  [SpeechSynthesisOutputFormat.Raw24Khz16BitMonoTrueSilk]: "raw-24khz-16bit-mono-truesilk",
  [SpeechSynthesisOutputFormat.Raw8Khz8BitMonoALaw]: "raw-8khz-8bit-mono-alaw",
  [SpeechSynthesisOutputFormat.Riff8Khz8BitMonoALaw]: "riff-8khz-8bit-mono-alaw",
  [SpeechSynthesisOutputFormat.Audio16Khz16Bit32KbpsMonoOpus]: "audio-16khz-16bit-32kbps-mono-opus",
  [SpeechSynthesisOutputFormat.Audio24Khz16Bit48KbpsMonoOpus]: "audio-24khz-16bit-48kbps-mono-opus",
  [SpeechSynthesisOutputFormat.Audio24Khz16Bit24KbpsMonoOpus]: "audio-24khz-16bit-24kbps-mono-opus",
  [SpeechSynthesisOutputFormat.Raw22050Hz16BitMonoPcm]: "raw-22050hz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Riff22050Hz16BitMonoPcm]: "riff-22050hz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Raw44100Hz16BitMonoPcm]: "raw-44100hz-16bit-mono-pcm",
  [SpeechSynthesisOutputFormat.Riff44100Hz16BitMonoPcm]: "riff-44100hz-16bit-mono-pcm"
};
var __awaiter$a = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class AudioOutputStream {
  constructor() {
    return;
  }
  static createPullStream() {
    return PullAudioOutputStream.create();
  }
}
class PullAudioOutputStream extends AudioOutputStream {
  static create() {
    return new PullAudioOutputStreamImpl();
  }
}
class PullAudioOutputStreamImpl extends PullAudioOutputStream {
  constructor() {
    super();
    this.privId = createNoDashGuid();
    this.privStream = new Stream();
  }
  set format(format) {
    if (format === void 0 || format === null) {
      this.privFormat = AudioOutputFormatImpl.getDefaultOutputFormat();
    }
    this.privFormat = format;
  }
  get format() {
    return this.privFormat;
  }
  get isClosed() {
    return this.privStream.isClosed;
  }
  id() {
    return this.privId;
  }
  read(dataBuffer) {
    return __awaiter$a(this, void 0, void 0, function* () {
      const intView = new Int8Array(dataBuffer);
      let totalBytes = 0;
      if (this.privLastChunkView !== void 0) {
        if (this.privLastChunkView.length > dataBuffer.byteLength) {
          intView.set(this.privLastChunkView.slice(0, dataBuffer.byteLength));
          this.privLastChunkView = this.privLastChunkView.slice(dataBuffer.byteLength);
          return Promise.resolve(dataBuffer.byteLength);
        }
        intView.set(this.privLastChunkView);
        totalBytes = this.privLastChunkView.length;
        this.privLastChunkView = void 0;
      }
      while (totalBytes < dataBuffer.byteLength && !this.privStream.isReadEnded) {
        const chunk = yield this.privStream.read();
        if (chunk !== void 0 && !chunk.isEnd) {
          let tmpBuffer;
          if (chunk.buffer.byteLength > dataBuffer.byteLength - totalBytes) {
            tmpBuffer = chunk.buffer.slice(0, dataBuffer.byteLength - totalBytes);
            this.privLastChunkView = new Int8Array(chunk.buffer.slice(dataBuffer.byteLength - totalBytes));
          } else {
            tmpBuffer = chunk.buffer;
          }
          intView.set(new Int8Array(tmpBuffer), totalBytes);
          totalBytes += tmpBuffer.byteLength;
        } else {
          this.privStream.readEnded();
        }
      }
      return totalBytes;
    });
  }
  write(dataBuffer) {
    Contracts.throwIfNullOrUndefined(this.privStream, "must set format before writing");
    this.privStream.writeStreamChunk({
      buffer: dataBuffer,
      isEnd: false,
      timeReceived: Date.now()
    });
  }
  close() {
    this.privStream.close();
  }
}
class PushAudioOutputStream extends AudioOutputStream {
  constructor() {
    super();
  }
  static create(callback) {
    return new PushAudioOutputStreamImpl(callback);
  }
}
class PushAudioOutputStreamImpl extends PushAudioOutputStream {
  constructor(callback) {
    super();
    this.privId = createNoDashGuid();
    this.privCallback = callback;
  }
  set format(format) {
  }
  write(buffer) {
    if (!!this.privCallback.write) {
      this.privCallback.write(buffer);
    }
  }
  close() {
    if (!!this.privCallback.close) {
      this.privCallback.close();
    }
  }
  id() {
    return this.privId;
  }
}
class AudioConfig {
  static fromDefaultMicrophoneInput() {
    const pcmRecorder = new PcmRecorder(true);
    return new AudioConfigImpl(new MicAudioSource(pcmRecorder));
  }
  static fromMicrophoneInput(deviceId) {
    const pcmRecorder = new PcmRecorder(true);
    return new AudioConfigImpl(new MicAudioSource(pcmRecorder, deviceId));
  }
  static fromWavFileInput(file, name = "unnamedBuffer.wav") {
    return new AudioConfigImpl(new FileAudioSource(file, name));
  }
  static fromStreamInput(audioStream) {
    if (audioStream instanceof PullAudioInputStreamCallback) {
      return new AudioConfigImpl(new PullAudioInputStreamImpl(audioStream));
    }
    if (audioStream instanceof AudioInputStream) {
      return new AudioConfigImpl(audioStream);
    }
    if (typeof MediaStream !== "undefined" && audioStream instanceof MediaStream) {
      const pcmRecorder = new PcmRecorder(false);
      return new AudioConfigImpl(new MicAudioSource(pcmRecorder, null, null, audioStream));
    }
    throw new Error("Not Supported Type");
  }
  static fromDefaultSpeakerOutput() {
    return new AudioOutputConfigImpl(new SpeakerAudioDestination());
  }
  static fromSpeakerOutput(player) {
    if (player === void 0) {
      return AudioConfig.fromDefaultSpeakerOutput();
    }
    if (player instanceof SpeakerAudioDestination) {
      return new AudioOutputConfigImpl(player);
    }
    throw new Error("Not Supported Type");
  }
  static fromAudioFileOutput(filename) {
    return new AudioOutputConfigImpl(new AudioFileWriter(filename));
  }
  static fromStreamOutput(audioStream) {
    if (audioStream instanceof PushAudioOutputStreamCallback) {
      return new AudioOutputConfigImpl(new PushAudioOutputStreamImpl(audioStream));
    }
    if (audioStream instanceof PushAudioOutputStream) {
      return new AudioOutputConfigImpl(audioStream);
    }
    if (audioStream instanceof PullAudioOutputStream) {
      return new AudioOutputConfigImpl(audioStream);
    }
    throw new Error("Not Supported Type");
  }
}
class AudioConfigImpl extends AudioConfig {
  constructor(source) {
    super();
    this.privSource = source;
  }
  get format() {
    return this.privSource.format;
  }
  close(cb, err) {
    this.privSource.turnOff().then(() => {
      if (!!cb) {
        cb();
      }
    }, (error) => {
      if (!!err) {
        err(error);
      }
    });
  }
  id() {
    return this.privSource.id();
  }
  get blob() {
    return this.privSource.blob;
  }
  turnOn() {
    return this.privSource.turnOn();
  }
  attach(audioNodeId) {
    return this.privSource.attach(audioNodeId);
  }
  detach(audioNodeId) {
    return this.privSource.detach(audioNodeId);
  }
  turnOff() {
    return this.privSource.turnOff();
  }
  get events() {
    return this.privSource.events;
  }
  setProperty(name, value) {
    Contracts.throwIfNull(value, "value");
    if (void 0 !== this.privSource.setProperty) {
      this.privSource.setProperty(name, value);
    } else {
      throw new Error("This AudioConfig instance does not support setting properties.");
    }
  }
  getProperty(name, def) {
    if (void 0 !== this.privSource.getProperty) {
      return this.privSource.getProperty(name, def);
    } else {
      throw new Error("This AudioConfig instance does not support getting properties.");
    }
  }
  get deviceInfo() {
    return this.privSource.deviceInfo;
  }
}
class AudioOutputConfigImpl extends AudioConfig {
  constructor(destination) {
    super();
    this.privDestination = destination;
  }
  set format(format) {
    this.privDestination.format = format;
  }
  write(buffer) {
    this.privDestination.write(buffer);
  }
  close() {
    this.privDestination.close();
  }
  id() {
    return this.privDestination.id();
  }
  setProperty() {
    throw new Error("This AudioConfig instance does not support setting properties.");
  }
  getProperty() {
    throw new Error("This AudioConfig instance does not support getting properties.");
  }
}
var CancellationReason;
(function(CancellationReason2) {
  CancellationReason2[CancellationReason2["Error"] = 0] = "Error";
  CancellationReason2[CancellationReason2["EndOfStream"] = 1] = "EndOfStream";
})(CancellationReason || (CancellationReason = {}));
class PullAudioInputStreamCallback {
}
class PushAudioOutputStreamCallback {
}
var OutputFormat;
(function(OutputFormat2) {
  OutputFormat2[OutputFormat2["Simple"] = 0] = "Simple";
  OutputFormat2[OutputFormat2["Detailed"] = 1] = "Detailed";
})(OutputFormat || (OutputFormat = {}));
var ResultReason;
(function(ResultReason2) {
  ResultReason2[ResultReason2["NoMatch"] = 0] = "NoMatch";
  ResultReason2[ResultReason2["Canceled"] = 1] = "Canceled";
  ResultReason2[ResultReason2["RecognizingSpeech"] = 2] = "RecognizingSpeech";
  ResultReason2[ResultReason2["RecognizedSpeech"] = 3] = "RecognizedSpeech";
  ResultReason2[ResultReason2["RecognizedKeyword"] = 4] = "RecognizedKeyword";
  ResultReason2[ResultReason2["RecognizingIntent"] = 5] = "RecognizingIntent";
  ResultReason2[ResultReason2["RecognizedIntent"] = 6] = "RecognizedIntent";
  ResultReason2[ResultReason2["TranslatingSpeech"] = 7] = "TranslatingSpeech";
  ResultReason2[ResultReason2["TranslatedSpeech"] = 8] = "TranslatedSpeech";
  ResultReason2[ResultReason2["SynthesizingAudio"] = 9] = "SynthesizingAudio";
  ResultReason2[ResultReason2["SynthesizingAudioCompleted"] = 10] = "SynthesizingAudioCompleted";
  ResultReason2[ResultReason2["SynthesizingAudioStarted"] = 11] = "SynthesizingAudioStarted";
  ResultReason2[ResultReason2["EnrollingVoiceProfile"] = 12] = "EnrollingVoiceProfile";
  ResultReason2[ResultReason2["EnrolledVoiceProfile"] = 13] = "EnrolledVoiceProfile";
  ResultReason2[ResultReason2["RecognizedSpeakers"] = 14] = "RecognizedSpeakers";
  ResultReason2[ResultReason2["RecognizedSpeaker"] = 15] = "RecognizedSpeaker";
  ResultReason2[ResultReason2["ResetVoiceProfile"] = 16] = "ResetVoiceProfile";
  ResultReason2[ResultReason2["DeletedVoiceProfile"] = 17] = "DeletedVoiceProfile";
  ResultReason2[ResultReason2["VoicesListRetrieved"] = 18] = "VoicesListRetrieved";
})(ResultReason || (ResultReason = {}));
class SpeechConfig {
  constructor() {
    return;
  }
  static fromSubscription(subscriptionKey, region) {
    Contracts.throwIfNullOrWhitespace(subscriptionKey, "subscriptionKey");
    Contracts.throwIfNullOrWhitespace(region, "region");
    const speechImpl = new SpeechConfigImpl();
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_Region, region);
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_IntentRegion, region);
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_Key, subscriptionKey);
    return speechImpl;
  }
  static fromEndpoint(endpoint, subscriptionKey) {
    Contracts.throwIfNull(endpoint, "endpoint");
    const speechImpl = new SpeechConfigImpl();
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_Endpoint, endpoint.href);
    if (void 0 !== subscriptionKey) {
      speechImpl.setProperty(PropertyId.SpeechServiceConnection_Key, subscriptionKey);
    }
    return speechImpl;
  }
  static fromHost(hostName, subscriptionKey) {
    Contracts.throwIfNull(hostName, "hostName");
    const speechImpl = new SpeechConfigImpl();
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_Host, hostName.protocol + "//" + hostName.hostname + (hostName.port === "" ? "" : ":" + hostName.port));
    if (void 0 !== subscriptionKey) {
      speechImpl.setProperty(PropertyId.SpeechServiceConnection_Key, subscriptionKey);
    }
    return speechImpl;
  }
  static fromAuthorizationToken(authorizationToken, region) {
    Contracts.throwIfNull(authorizationToken, "authorizationToken");
    Contracts.throwIfNullOrWhitespace(region, "region");
    const speechImpl = new SpeechConfigImpl();
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_Region, region);
    speechImpl.setProperty(PropertyId.SpeechServiceConnection_IntentRegion, region);
    speechImpl.authorizationToken = authorizationToken;
    return speechImpl;
  }
  close() {
  }
}
class SpeechConfigImpl extends SpeechConfig {
  constructor() {
    super();
    this.privProperties = new PropertyCollection();
    this.speechRecognitionLanguage = "en-US";
    this.outputFormat = OutputFormat.Simple;
  }
  get properties() {
    return this.privProperties;
  }
  get endPoint() {
    return new URL(this.privProperties.getProperty(PropertyId.SpeechServiceConnection_Endpoint));
  }
  get subscriptionKey() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_Key);
  }
  get region() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_Region);
  }
  get authorizationToken() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceAuthorization_Token);
  }
  set authorizationToken(value) {
    this.privProperties.setProperty(PropertyId.SpeechServiceAuthorization_Token, value);
  }
  get speechRecognitionLanguage() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_RecoLanguage);
  }
  set speechRecognitionLanguage(value) {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_RecoLanguage, value);
  }
  get autoDetectSourceLanguages() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguages);
  }
  set autoDetectSourceLanguages(value) {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguages, value);
  }
  get outputFormat() {
    return OutputFormat[this.privProperties.getProperty(OutputFormatPropertyName, void 0)];
  }
  set outputFormat(value) {
    this.privProperties.setProperty(OutputFormatPropertyName, OutputFormat[value]);
  }
  get endpointId() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_EndpointId);
  }
  set endpointId(value) {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_EndpointId, value);
  }
  setProperty(name, value) {
    Contracts.throwIfNull(value, "value");
    this.privProperties.setProperty(name, value);
  }
  getProperty(name, def) {
    return this.privProperties.getProperty(name, def);
  }
  setProxy(proxyHostName, proxyPort, proxyUserName, proxyPassword) {
    this.setProperty(PropertyId[PropertyId.SpeechServiceConnection_ProxyHostName], proxyHostName);
    this.setProperty(PropertyId[PropertyId.SpeechServiceConnection_ProxyPort], proxyPort);
    this.setProperty(PropertyId[PropertyId.SpeechServiceConnection_ProxyUserName], proxyUserName);
    this.setProperty(PropertyId[PropertyId.SpeechServiceConnection_ProxyPassword], proxyPassword);
  }
  setServiceProperty(name, value) {
    const currentProperties = JSON.parse(this.privProperties.getProperty(ServicePropertiesPropertyName, "{}"));
    currentProperties[name] = value;
    this.privProperties.setProperty(ServicePropertiesPropertyName, JSON.stringify(currentProperties));
  }
  setProfanity(profanity) {
    this.privProperties.setProperty(PropertyId.SpeechServiceResponse_ProfanityOption, ProfanityOption[profanity]);
  }
  enableAudioLogging() {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_EnableAudioLogging, "true");
  }
  requestWordLevelTimestamps() {
    this.privProperties.setProperty(PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps, "true");
  }
  enableDictation() {
    this.privProperties.setProperty(ForceDictationPropertyName, "true");
  }
  clone() {
    const ret = new SpeechConfigImpl();
    ret.privProperties = this.privProperties.clone();
    return ret;
  }
  get speechSynthesisLanguage() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_SynthLanguage);
  }
  set speechSynthesisLanguage(language) {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_SynthLanguage, language);
  }
  get speechSynthesisVoiceName() {
    return this.privProperties.getProperty(PropertyId.SpeechServiceConnection_SynthVoice);
  }
  set speechSynthesisVoiceName(voice) {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_SynthVoice, voice);
  }
  get speechSynthesisOutputFormat() {
    return SpeechSynthesisOutputFormat[this.privProperties.getProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat, void 0)];
  }
  set speechSynthesisOutputFormat(format) {
    this.privProperties.setProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat, SpeechSynthesisOutputFormat[format]);
  }
}
class PropertyCollection {
  constructor() {
    this.privKeys = [];
    this.privValues = [];
  }
  getProperty(key, def) {
    let keyToUse;
    if (typeof key === "string") {
      keyToUse = key;
    } else {
      keyToUse = PropertyId[key];
    }
    for (let n = 0; n < this.privKeys.length; n++) {
      if (this.privKeys[n] === keyToUse) {
        return this.privValues[n];
      }
    }
    if (def === void 0) {
      return void 0;
    }
    return String(def);
  }
  setProperty(key, value) {
    let keyToUse;
    if (typeof key === "string") {
      keyToUse = key;
    } else {
      keyToUse = PropertyId[key];
    }
    for (let n = 0; n < this.privKeys.length; n++) {
      if (this.privKeys[n] === keyToUse) {
        this.privValues[n] = value;
        return;
      }
    }
    this.privKeys.push(keyToUse);
    this.privValues.push(value);
  }
  clone() {
    const clonedMap = new PropertyCollection();
    for (let n = 0; n < this.privKeys.length; n++) {
      clonedMap.privKeys.push(this.privKeys[n]);
      clonedMap.privValues.push(this.privValues[n]);
    }
    return clonedMap;
  }
  mergeTo(destinationCollection) {
    this.privKeys.forEach((key) => {
      if (destinationCollection.getProperty(key, void 0) === void 0) {
        const value = this.getProperty(key);
        destinationCollection.setProperty(key, value);
      }
    });
  }
  get keys() {
    return this.privKeys;
  }
}
var PropertyId;
(function(PropertyId2) {
  PropertyId2[PropertyId2["SpeechServiceConnection_Key"] = 0] = "SpeechServiceConnection_Key";
  PropertyId2[PropertyId2["SpeechServiceConnection_Endpoint"] = 1] = "SpeechServiceConnection_Endpoint";
  PropertyId2[PropertyId2["SpeechServiceConnection_Region"] = 2] = "SpeechServiceConnection_Region";
  PropertyId2[PropertyId2["SpeechServiceAuthorization_Token"] = 3] = "SpeechServiceAuthorization_Token";
  PropertyId2[PropertyId2["SpeechServiceAuthorization_Type"] = 4] = "SpeechServiceAuthorization_Type";
  PropertyId2[PropertyId2["SpeechServiceConnection_EndpointId"] = 5] = "SpeechServiceConnection_EndpointId";
  PropertyId2[PropertyId2["SpeechServiceConnection_TranslationToLanguages"] = 6] = "SpeechServiceConnection_TranslationToLanguages";
  PropertyId2[PropertyId2["SpeechServiceConnection_TranslationVoice"] = 7] = "SpeechServiceConnection_TranslationVoice";
  PropertyId2[PropertyId2["SpeechServiceConnection_TranslationFeatures"] = 8] = "SpeechServiceConnection_TranslationFeatures";
  PropertyId2[PropertyId2["SpeechServiceConnection_IntentRegion"] = 9] = "SpeechServiceConnection_IntentRegion";
  PropertyId2[PropertyId2["SpeechServiceConnection_ProxyHostName"] = 10] = "SpeechServiceConnection_ProxyHostName";
  PropertyId2[PropertyId2["SpeechServiceConnection_ProxyPort"] = 11] = "SpeechServiceConnection_ProxyPort";
  PropertyId2[PropertyId2["SpeechServiceConnection_ProxyUserName"] = 12] = "SpeechServiceConnection_ProxyUserName";
  PropertyId2[PropertyId2["SpeechServiceConnection_ProxyPassword"] = 13] = "SpeechServiceConnection_ProxyPassword";
  PropertyId2[PropertyId2["SpeechServiceConnection_RecoMode"] = 14] = "SpeechServiceConnection_RecoMode";
  PropertyId2[PropertyId2["SpeechServiceConnection_RecoLanguage"] = 15] = "SpeechServiceConnection_RecoLanguage";
  PropertyId2[PropertyId2["Speech_SessionId"] = 16] = "Speech_SessionId";
  PropertyId2[PropertyId2["SpeechServiceConnection_SynthLanguage"] = 17] = "SpeechServiceConnection_SynthLanguage";
  PropertyId2[PropertyId2["SpeechServiceConnection_SynthVoice"] = 18] = "SpeechServiceConnection_SynthVoice";
  PropertyId2[PropertyId2["SpeechServiceConnection_SynthOutputFormat"] = 19] = "SpeechServiceConnection_SynthOutputFormat";
  PropertyId2[PropertyId2["SpeechServiceConnection_AutoDetectSourceLanguages"] = 20] = "SpeechServiceConnection_AutoDetectSourceLanguages";
  PropertyId2[PropertyId2["SpeechServiceResponse_RequestDetailedResultTrueFalse"] = 21] = "SpeechServiceResponse_RequestDetailedResultTrueFalse";
  PropertyId2[PropertyId2["SpeechServiceResponse_RequestProfanityFilterTrueFalse"] = 22] = "SpeechServiceResponse_RequestProfanityFilterTrueFalse";
  PropertyId2[PropertyId2["SpeechServiceResponse_JsonResult"] = 23] = "SpeechServiceResponse_JsonResult";
  PropertyId2[PropertyId2["SpeechServiceResponse_JsonErrorDetails"] = 24] = "SpeechServiceResponse_JsonErrorDetails";
  PropertyId2[PropertyId2["CancellationDetails_Reason"] = 25] = "CancellationDetails_Reason";
  PropertyId2[PropertyId2["CancellationDetails_ReasonText"] = 26] = "CancellationDetails_ReasonText";
  PropertyId2[PropertyId2["CancellationDetails_ReasonDetailedText"] = 27] = "CancellationDetails_ReasonDetailedText";
  PropertyId2[PropertyId2["LanguageUnderstandingServiceResponse_JsonResult"] = 28] = "LanguageUnderstandingServiceResponse_JsonResult";
  PropertyId2[PropertyId2["SpeechServiceConnection_Url"] = 29] = "SpeechServiceConnection_Url";
  PropertyId2[PropertyId2["SpeechServiceConnection_InitialSilenceTimeoutMs"] = 30] = "SpeechServiceConnection_InitialSilenceTimeoutMs";
  PropertyId2[PropertyId2["SpeechServiceConnection_EndSilenceTimeoutMs"] = 31] = "SpeechServiceConnection_EndSilenceTimeoutMs";
  PropertyId2[PropertyId2["Speech_SegmentationSilenceTimeoutMs"] = 32] = "Speech_SegmentationSilenceTimeoutMs";
  PropertyId2[PropertyId2["SpeechServiceConnection_EnableAudioLogging"] = 33] = "SpeechServiceConnection_EnableAudioLogging";
  PropertyId2[PropertyId2["SpeechServiceConnection_AtStartLanguageIdPriority"] = 34] = "SpeechServiceConnection_AtStartLanguageIdPriority";
  PropertyId2[PropertyId2["SpeechServiceConnection_ContinuousLanguageIdPriority"] = 35] = "SpeechServiceConnection_ContinuousLanguageIdPriority";
  PropertyId2[PropertyId2["SpeechServiceConnection_RecognitionEndpointVersion"] = 36] = "SpeechServiceConnection_RecognitionEndpointVersion";
  PropertyId2[PropertyId2["SpeechServiceResponse_ProfanityOption"] = 37] = "SpeechServiceResponse_ProfanityOption";
  PropertyId2[PropertyId2["SpeechServiceResponse_PostProcessingOption"] = 38] = "SpeechServiceResponse_PostProcessingOption";
  PropertyId2[PropertyId2["SpeechServiceResponse_RequestWordLevelTimestamps"] = 39] = "SpeechServiceResponse_RequestWordLevelTimestamps";
  PropertyId2[PropertyId2["SpeechServiceResponse_StablePartialResultThreshold"] = 40] = "SpeechServiceResponse_StablePartialResultThreshold";
  PropertyId2[PropertyId2["SpeechServiceResponse_OutputFormatOption"] = 41] = "SpeechServiceResponse_OutputFormatOption";
  PropertyId2[PropertyId2["SpeechServiceResponse_TranslationRequestStablePartialResult"] = 42] = "SpeechServiceResponse_TranslationRequestStablePartialResult";
  PropertyId2[PropertyId2["SpeechServiceResponse_RequestWordBoundary"] = 43] = "SpeechServiceResponse_RequestWordBoundary";
  PropertyId2[PropertyId2["SpeechServiceResponse_RequestPunctuationBoundary"] = 44] = "SpeechServiceResponse_RequestPunctuationBoundary";
  PropertyId2[PropertyId2["SpeechServiceResponse_RequestSentenceBoundary"] = 45] = "SpeechServiceResponse_RequestSentenceBoundary";
  PropertyId2[PropertyId2["Conversation_ApplicationId"] = 46] = "Conversation_ApplicationId";
  PropertyId2[PropertyId2["Conversation_DialogType"] = 47] = "Conversation_DialogType";
  PropertyId2[PropertyId2["Conversation_Initial_Silence_Timeout"] = 48] = "Conversation_Initial_Silence_Timeout";
  PropertyId2[PropertyId2["Conversation_From_Id"] = 49] = "Conversation_From_Id";
  PropertyId2[PropertyId2["Conversation_Conversation_Id"] = 50] = "Conversation_Conversation_Id";
  PropertyId2[PropertyId2["Conversation_Custom_Voice_Deployment_Ids"] = 51] = "Conversation_Custom_Voice_Deployment_Ids";
  PropertyId2[PropertyId2["Conversation_Speech_Activity_Template"] = 52] = "Conversation_Speech_Activity_Template";
  PropertyId2[PropertyId2["Conversation_Request_Bot_Status_Messages"] = 53] = "Conversation_Request_Bot_Status_Messages";
  PropertyId2[PropertyId2["Conversation_Agent_Connection_Id"] = 54] = "Conversation_Agent_Connection_Id";
  PropertyId2[PropertyId2["SpeechServiceConnection_Host"] = 55] = "SpeechServiceConnection_Host";
  PropertyId2[PropertyId2["ConversationTranslator_Host"] = 56] = "ConversationTranslator_Host";
  PropertyId2[PropertyId2["ConversationTranslator_Name"] = 57] = "ConversationTranslator_Name";
  PropertyId2[PropertyId2["ConversationTranslator_CorrelationId"] = 58] = "ConversationTranslator_CorrelationId";
  PropertyId2[PropertyId2["ConversationTranslator_Token"] = 59] = "ConversationTranslator_Token";
  PropertyId2[PropertyId2["PronunciationAssessment_ReferenceText"] = 60] = "PronunciationAssessment_ReferenceText";
  PropertyId2[PropertyId2["PronunciationAssessment_GradingSystem"] = 61] = "PronunciationAssessment_GradingSystem";
  PropertyId2[PropertyId2["PronunciationAssessment_Granularity"] = 62] = "PronunciationAssessment_Granularity";
  PropertyId2[PropertyId2["PronunciationAssessment_EnableMiscue"] = 63] = "PronunciationAssessment_EnableMiscue";
  PropertyId2[PropertyId2["PronunciationAssessment_Json"] = 64] = "PronunciationAssessment_Json";
  PropertyId2[PropertyId2["PronunciationAssessment_Params"] = 65] = "PronunciationAssessment_Params";
  PropertyId2[PropertyId2["SpeakerRecognition_Api_Version"] = 66] = "SpeakerRecognition_Api_Version";
})(PropertyId || (PropertyId = {}));
var CancellationErrorCode;
(function(CancellationErrorCode2) {
  CancellationErrorCode2[CancellationErrorCode2["NoError"] = 0] = "NoError";
  CancellationErrorCode2[CancellationErrorCode2["AuthenticationFailure"] = 1] = "AuthenticationFailure";
  CancellationErrorCode2[CancellationErrorCode2["BadRequestParameters"] = 2] = "BadRequestParameters";
  CancellationErrorCode2[CancellationErrorCode2["TooManyRequests"] = 3] = "TooManyRequests";
  CancellationErrorCode2[CancellationErrorCode2["ConnectionFailure"] = 4] = "ConnectionFailure";
  CancellationErrorCode2[CancellationErrorCode2["ServiceTimeout"] = 5] = "ServiceTimeout";
  CancellationErrorCode2[CancellationErrorCode2["ServiceError"] = 6] = "ServiceError";
  CancellationErrorCode2[CancellationErrorCode2["RuntimeError"] = 7] = "RuntimeError";
  CancellationErrorCode2[CancellationErrorCode2["Forbidden"] = 8] = "Forbidden";
})(CancellationErrorCode || (CancellationErrorCode = {}));
class QueryParameterNames {
}
QueryParameterNames.BotId = "botid";
QueryParameterNames.CustomSpeechDeploymentId = "cid";
QueryParameterNames.CustomVoiceDeploymentId = "deploymentId";
QueryParameterNames.EnableAudioLogging = "storeAudio";
QueryParameterNames.EnableLanguageId = "lidEnabled";
QueryParameterNames.EnableWordLevelTimestamps = "wordLevelTimestamps";
QueryParameterNames.EndSilenceTimeoutMs = "endSilenceTimeoutMs";
QueryParameterNames.SegmentationSilenceTimeoutMs = "segmentationSilenceTimeoutMs";
QueryParameterNames.Format = "format";
QueryParameterNames.InitialSilenceTimeoutMs = "initialSilenceTimeoutMs";
QueryParameterNames.Language = "language";
QueryParameterNames.Profanity = "profanity";
QueryParameterNames.RequestBotStatusMessages = "enableBotMessageStatus";
QueryParameterNames.StableIntermediateThreshold = "stableIntermediateThreshold";
QueryParameterNames.StableTranslation = "stableTranslation";
QueryParameterNames.TestHooks = "testhooks";
QueryParameterNames.Postprocessing = "postprocessing";
class ConnectionFactoryBase {
  static getHostSuffix(region) {
    if (!!region) {
      if (region.toLowerCase().startsWith("china")) {
        return ".azure.cn";
      }
      if (region.toLowerCase().startsWith("usgov")) {
        return ".azure.us";
      }
    }
    return ".microsoft.com";
  }
  setCommonUrlParams(config, queryParams, endpoint) {
    const propertyIdToParameterMap = /* @__PURE__ */ new Map([
      [PropertyId.Speech_SegmentationSilenceTimeoutMs, QueryParameterNames.SegmentationSilenceTimeoutMs],
      [PropertyId.SpeechServiceConnection_EnableAudioLogging, QueryParameterNames.EnableAudioLogging],
      [PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, QueryParameterNames.EndSilenceTimeoutMs],
      [PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, QueryParameterNames.InitialSilenceTimeoutMs],
      [PropertyId.SpeechServiceResponse_PostProcessingOption, QueryParameterNames.Postprocessing],
      [PropertyId.SpeechServiceResponse_ProfanityOption, QueryParameterNames.Profanity],
      [PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps, QueryParameterNames.EnableWordLevelTimestamps],
      [PropertyId.SpeechServiceResponse_StablePartialResultThreshold, QueryParameterNames.StableIntermediateThreshold]
    ]);
    propertyIdToParameterMap.forEach((parameterName, propertyId) => {
      this.setUrlParameter(propertyId, parameterName, config, queryParams, endpoint);
    });
    const serviceProperties = JSON.parse(config.parameters.getProperty(ServicePropertiesPropertyName, "{}"));
    Object.keys(serviceProperties).forEach((value) => {
      queryParams[value] = serviceProperties[value];
    });
  }
  setUrlParameter(propId, parameterName, config, queryParams, endpoint) {
    const value = config.parameters.getProperty(propId, void 0);
    if (value && (!endpoint || endpoint.search(parameterName) === -1)) {
      queryParams[parameterName] = value.toLocaleLowerCase();
    }
  }
}
var ProfanityOption;
(function(ProfanityOption2) {
  ProfanityOption2[ProfanityOption2["Masked"] = 0] = "Masked";
  ProfanityOption2[ProfanityOption2["Removed"] = 1] = "Removed";
  ProfanityOption2[ProfanityOption2["Raw"] = 2] = "Raw";
})(ProfanityOption || (ProfanityOption = {}));
var __awaiter$9 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class SpeechSynthesizer {
  constructor(speechConfig, audioConfig) {
    const speechConfigImpl = speechConfig;
    Contracts.throwIfNull(speechConfigImpl, "speechConfig");
    if (audioConfig !== null) {
      if (audioConfig === void 0) {
        this.audioConfig = typeof window === "undefined" ? void 0 : AudioConfig.fromDefaultSpeakerOutput();
      } else {
        this.audioConfig = audioConfig;
      }
    }
    this.privProperties = speechConfigImpl.properties.clone();
    this.privDisposed = false;
    this.privSynthesizing = false;
    this.privConnectionFactory = new SpeechSynthesisConnectionFactory();
    this.synthesisRequestQueue = new Queue();
    this.implCommonSynthesizeSetup();
  }
  get authorizationToken() {
    return this.properties.getProperty(PropertyId.SpeechServiceAuthorization_Token);
  }
  set authorizationToken(token) {
    Contracts.throwIfNullOrWhitespace(token, "token");
    this.properties.setProperty(PropertyId.SpeechServiceAuthorization_Token, token);
  }
  get properties() {
    return this.privProperties;
  }
  get autoDetectSourceLanguage() {
    return this.properties.getProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguages) === AutoDetectSourceLanguagesOpenRangeOptionName;
  }
  static FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig) {
    const speechConfigImpl = speechConfig;
    autoDetectSourceLanguageConfig.properties.mergeTo(speechConfigImpl.properties);
    return new SpeechSynthesizer(speechConfig, audioConfig);
  }
  buildSsml(text) {
    const languageToDefaultVoice = {
      ["af-ZA"]: "af-ZA-AdriNeural",
      ["am-ET"]: "am-ET-AmehaNeural",
      ["ar-AE"]: "ar-AE-FatimaNeural",
      ["ar-BH"]: "ar-BH-AliNeural",
      ["ar-DZ"]: "ar-DZ-AminaNeural",
      ["ar-EG"]: "ar-EG-SalmaNeural",
      ["ar-IQ"]: "ar-IQ-BasselNeural",
      ["ar-JO"]: "ar-JO-SanaNeural",
      ["ar-KW"]: "ar-KW-FahedNeural",
      ["ar-LY"]: "ar-LY-ImanNeural",
      ["ar-MA"]: "ar-MA-JamalNeural",
      ["ar-QA"]: "ar-QA-AmalNeural",
      ["ar-SA"]: "ar-SA-HamedNeural",
      ["ar-SY"]: "ar-SY-AmanyNeural",
      ["ar-TN"]: "ar-TN-HediNeural",
      ["ar-YE"]: "ar-YE-MaryamNeural",
      ["bg-BG"]: "bg-BG-BorislavNeural",
      ["bn-BD"]: "bn-BD-NabanitaNeural",
      ["bn-IN"]: "bn-IN-BashkarNeural",
      ["ca-ES"]: "ca-ES-JoanaNeural",
      ["cs-CZ"]: "cs-CZ-AntoninNeural",
      ["cy-GB"]: "cy-GB-AledNeural",
      ["da-DK"]: "da-DK-ChristelNeural",
      ["de-AT"]: "de-AT-IngridNeural",
      ["de-CH"]: "de-CH-JanNeural",
      ["de-DE"]: "de-DE-KatjaNeural",
      ["el-GR"]: "el-GR-AthinaNeural",
      ["en-AU"]: "en-AU-NatashaNeural",
      ["en-CA"]: "en-CA-ClaraNeural",
      ["en-GB"]: "en-GB-LibbyNeural",
      ["en-HK"]: "en-HK-SamNeural",
      ["en-IE"]: "en-IE-ConnorNeural",
      ["en-IN"]: "en-IN-NeerjaNeural",
      ["en-KE"]: "en-KE-AsiliaNeural",
      ["en-NG"]: "en-NG-AbeoNeural",
      ["en-NZ"]: "en-NZ-MitchellNeural",
      ["en-PH"]: "en-PH-JamesNeural",
      ["en-SG"]: "en-SG-LunaNeural",
      ["en-TZ"]: "en-TZ-ElimuNeural",
      ["en-US"]: "en-US-JennyNeural",
      ["en-ZA"]: "en-ZA-LeahNeural",
      ["es-AR"]: "es-AR-ElenaNeural",
      ["es-BO"]: "es-BO-MarceloNeural",
      ["es-CL"]: "es-CL-CatalinaNeural",
      ["es-CO"]: "es-CO-GonzaloNeural",
      ["es-CR"]: "es-CR-JuanNeural",
      ["es-CU"]: "es-CU-BelkysNeural",
      ["es-DO"]: "es-DO-EmilioNeural",
      ["es-EC"]: "es-EC-AndreaNeural",
      ["es-ES"]: "es-ES-AlvaroNeural",
      ["es-GQ"]: "es-GQ-JavierNeural",
      ["es-GT"]: "es-GT-AndresNeural",
      ["es-HN"]: "es-HN-CarlosNeural",
      ["es-MX"]: "es-MX-DaliaNeural",
      ["es-NI"]: "es-NI-FedericoNeural",
      ["es-PA"]: "es-PA-MargaritaNeural",
      ["es-PE"]: "es-PE-AlexNeural",
      ["es-PR"]: "es-PR-KarinaNeural",
      ["es-PY"]: "es-PY-MarioNeural",
      ["es-SV"]: "es-SV-LorenaNeural",
      ["es-US"]: "es-US-AlonsoNeural",
      ["es-UY"]: "es-UY-MateoNeural",
      ["es-VE"]: "es-VE-PaolaNeural",
      ["et-EE"]: "et-EE-AnuNeural",
      ["fa-IR"]: "fa-IR-DilaraNeural",
      ["fi-FI"]: "fi-FI-SelmaNeural",
      ["fil-PH"]: "fil-PH-AngeloNeural",
      ["fr-BE"]: "fr-BE-CharlineNeural",
      ["fr-CA"]: "fr-CA-SylvieNeural",
      ["fr-CH"]: "fr-CH-ArianeNeural",
      ["fr-FR"]: "fr-FR-DeniseNeural",
      ["ga-IE"]: "ga-IE-ColmNeural",
      ["gl-ES"]: "gl-ES-RoiNeural",
      ["gu-IN"]: "gu-IN-DhwaniNeural",
      ["he-IL"]: "he-IL-AvriNeural",
      ["hi-IN"]: "hi-IN-MadhurNeural",
      ["hr-HR"]: "hr-HR-GabrijelaNeural",
      ["hu-HU"]: "hu-HU-NoemiNeural",
      ["id-ID"]: "id-ID-ArdiNeural",
      ["is-IS"]: "is-IS-GudrunNeural",
      ["it-IT"]: "it-IT-IsabellaNeural",
      ["ja-JP"]: "ja-JP-NanamiNeural",
      ["jv-ID"]: "jv-ID-DimasNeural",
      ["kk-KZ"]: "kk-KZ-AigulNeural",
      ["km-KH"]: "km-KH-PisethNeural",
      ["kn-IN"]: "kn-IN-GaganNeural",
      ["ko-KR"]: "ko-KR-SunHiNeural",
      ["lo-LA"]: "lo-LA-ChanthavongNeural",
      ["lt-LT"]: "lt-LT-LeonasNeural",
      ["lv-LV"]: "lv-LV-EveritaNeural",
      ["mk-MK"]: "mk-MK-AleksandarNeural",
      ["ml-IN"]: "ml-IN-MidhunNeural",
      ["mr-IN"]: "mr-IN-AarohiNeural",
      ["ms-MY"]: "ms-MY-OsmanNeural",
      ["mt-MT"]: "mt-MT-GraceNeural",
      ["my-MM"]: "my-MM-NilarNeural",
      ["nb-NO"]: "nb-NO-PernilleNeural",
      ["nl-BE"]: "nl-BE-ArnaudNeural",
      ["nl-NL"]: "nl-NL-ColetteNeural",
      ["pl-PL"]: "pl-PL-AgnieszkaNeural",
      ["ps-AF"]: "ps-AF-GulNawazNeural",
      ["pt-BR"]: "pt-BR-FranciscaNeural",
      ["pt-PT"]: "pt-PT-DuarteNeural",
      ["ro-RO"]: "ro-RO-AlinaNeural",
      ["ru-RU"]: "ru-RU-SvetlanaNeural",
      ["si-LK"]: "si-LK-SameeraNeural",
      ["sk-SK"]: "sk-SK-LukasNeural",
      ["sl-SI"]: "sl-SI-PetraNeural",
      ["so-SO"]: "so-SO-MuuseNeural",
      ["sr-RS"]: "sr-RS-NicholasNeural",
      ["su-ID"]: "su-ID-JajangNeural",
      ["sv-SE"]: "sv-SE-SofieNeural",
      ["sw-KE"]: "sw-KE-RafikiNeural",
      ["sw-TZ"]: "sw-TZ-DaudiNeural",
      ["ta-IN"]: "ta-IN-PallaviNeural",
      ["ta-LK"]: "ta-LK-KumarNeural",
      ["ta-SG"]: "ta-SG-AnbuNeural",
      ["te-IN"]: "te-IN-MohanNeural",
      ["th-TH"]: "th-TH-PremwadeeNeural",
      ["tr-TR"]: "tr-TR-AhmetNeural",
      ["uk-UA"]: "uk-UA-OstapNeural",
      ["ur-IN"]: "ur-IN-GulNeural",
      ["ur-PK"]: "ur-PK-AsadNeural",
      ["uz-UZ"]: "uz-UZ-MadinaNeural",
      ["vi-VN"]: "vi-VN-HoaiMyNeural",
      ["zh-CN"]: "zh-CN-XiaoxiaoNeural",
      ["zh-HK"]: "zh-HK-HiuMaanNeural",
      ["zh-TW"]: "zh-TW-HsiaoChenNeural",
      ["zu-ZA"]: "zu-ZA-ThandoNeural"
    };
    let language = this.properties.getProperty(PropertyId.SpeechServiceConnection_SynthLanguage, "en-US");
    let voice = this.properties.getProperty(PropertyId.SpeechServiceConnection_SynthVoice, "");
    let ssml = SpeechSynthesizer.XMLEncode(text);
    if (this.autoDetectSourceLanguage) {
      language = "en-US";
    } else {
      voice = voice || languageToDefaultVoice[language];
    }
    if (voice) {
      ssml = `<voice name='${voice}'>${ssml}</voice>`;
    }
    ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xmlns:emo='http://www.w3.org/2009/10/emotionml' xml:lang='${language}'>${ssml}</speak>`;
    return ssml;
  }
  speakTextAsync(text, cb, err, stream) {
    this.speakImpl(text, false, cb, err, stream);
  }
  speakSsmlAsync(ssml, cb, err, stream) {
    this.speakImpl(ssml, true, cb, err, stream);
  }
  getVoicesAsync(locale = "") {
    return __awaiter$9(this, void 0, void 0, function* () {
      return this.getVoices(locale);
    });
  }
  close(cb, err) {
    Contracts.throwIfDisposed(this.privDisposed);
    marshalPromiseToCallbacks(this.dispose(true), cb, err);
  }
  get internalData() {
    return this.privAdapter;
  }
  dispose(disposing) {
    return __awaiter$9(this, void 0, void 0, function* () {
      if (this.privDisposed) {
        return;
      }
      if (disposing) {
        if (this.privAdapter) {
          yield this.privAdapter.dispose();
        }
      }
      this.privDisposed = true;
    });
  }
  createSynthesizerConfig(speechConfig) {
    return new SynthesizerConfig(speechConfig, this.privProperties);
  }
  createSynthesisAdapter(authentication, connectionFactory, audioConfig, synthesizerConfig) {
    return new SynthesisAdapterBase(authentication, connectionFactory, synthesizerConfig, this, this.audioConfig);
  }
  implCommonSynthesizeSetup() {
    let osPlatform = typeof window !== "undefined" ? "Browser" : "Node";
    let osName = "unknown";
    let osVersion = "unknown";
    if (typeof navigator !== "undefined") {
      osPlatform = osPlatform + "/" + navigator.platform;
      osName = navigator.userAgent;
      osVersion = navigator.appVersion;
    }
    const synthesizerConfig = this.createSynthesizerConfig(new SpeechServiceConfig(new Context(new OS(osPlatform, osName, osVersion))));
    const subscriptionKey = this.privProperties.getProperty(PropertyId.SpeechServiceConnection_Key, void 0);
    const authentication = subscriptionKey && subscriptionKey !== "" ? new CognitiveSubscriptionKeyAuthentication(subscriptionKey) : new CognitiveTokenAuthentication(() => {
      const authorizationToken = this.privProperties.getProperty(PropertyId.SpeechServiceAuthorization_Token, void 0);
      return Promise.resolve(authorizationToken);
    }, () => {
      const authorizationToken = this.privProperties.getProperty(PropertyId.SpeechServiceAuthorization_Token, void 0);
      return Promise.resolve(authorizationToken);
    });
    this.privAdapter = this.createSynthesisAdapter(authentication, this.privConnectionFactory, this.audioConfig, synthesizerConfig);
    this.privAdapter.audioOutputFormat = AudioOutputFormatImpl.fromSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat[this.properties.getProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat, void 0)]);
    this.privRestAdapter = new SynthesisRestAdapter(synthesizerConfig);
  }
  speakImpl(text, IsSsml, cb, err, dataStream) {
    try {
      Contracts.throwIfDisposed(this.privDisposed);
      const requestId = createNoDashGuid();
      let audioDestination;
      if (dataStream instanceof PushAudioOutputStreamCallback) {
        audioDestination = new PushAudioOutputStreamImpl(dataStream);
      } else if (dataStream instanceof PullAudioOutputStream) {
        audioDestination = dataStream;
      } else if (dataStream !== void 0) {
        audioDestination = new AudioFileWriter(dataStream);
      } else {
        audioDestination = void 0;
      }
      this.synthesisRequestQueue.enqueue(new SynthesisRequest(requestId, text, IsSsml, (e) => {
        this.privSynthesizing = false;
        if (!!cb) {
          try {
            cb(e);
          } catch (e2) {
            if (!!err) {
              err(e2);
            }
          }
        }
        cb = void 0;
        this.adapterSpeak().catch(() => {
        });
      }, (e) => {
        if (!!err) {
          err(e);
        }
      }, audioDestination));
      this.adapterSpeak().catch(() => {
      });
    } catch (error) {
      if (!!err) {
        if (error instanceof Error) {
          const typedError = error;
          err(typedError.name + ": " + typedError.message);
        } else {
          err(error);
        }
      }
      this.dispose(true).catch(() => {
      });
    }
  }
  getVoices(locale) {
    return __awaiter$9(this, void 0, void 0, function* () {
      const requestId = createNoDashGuid();
      const response = yield this.privRestAdapter.getVoicesList(requestId);
      if (response.ok && Array.isArray(response.json)) {
        let json = response.json;
        if (!!locale && locale.length > 0) {
          json = json.filter((item) => !!item.Locale && item.Locale.toLowerCase() === locale.toLowerCase());
        }
        return new SynthesisVoicesResult(requestId, json, void 0);
      } else {
        return new SynthesisVoicesResult(requestId, void 0, `Error: ${response.status}: ${response.statusText}`);
      }
    });
  }
  adapterSpeak() {
    return __awaiter$9(this, void 0, void 0, function* () {
      if (!this.privDisposed && !this.privSynthesizing) {
        this.privSynthesizing = true;
        const request = yield this.synthesisRequestQueue.dequeue();
        return this.privAdapter.Speak(request.text, request.isSSML, request.requestId, request.cb, request.err, request.dataStream);
      }
    });
  }
  static XMLEncode(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
}
class SynthesisRequest {
  constructor(requestId, text, isSSML, cb, err, dataStream) {
    this.requestId = requestId;
    this.text = text;
    this.isSSML = isSSML;
    this.cb = cb;
    this.err = err;
    this.dataStream = dataStream;
  }
}
class SynthesisResult {
  constructor(resultId, reason, errorDetails, properties) {
    this.privResultId = resultId;
    this.privReason = reason;
    this.privErrorDetails = errorDetails;
    this.privProperties = properties;
  }
  get resultId() {
    return this.privResultId;
  }
  get reason() {
    return this.privReason;
  }
  get errorDetails() {
    return this.privErrorDetails;
  }
  get properties() {
    return this.privProperties;
  }
}
class SpeechSynthesisResult extends SynthesisResult {
  constructor(resultId, reason, audioData, errorDetails, properties, audioDuration) {
    super(resultId, reason, errorDetails, properties);
    this.privAudioData = audioData;
    this.privAudioDuration = audioDuration;
  }
  get audioData() {
    return this.privAudioData;
  }
  get audioDuration() {
    return this.privAudioDuration;
  }
}
class SpeechSynthesisEventArgs {
  constructor(result) {
    this.privResult = result;
  }
  get result() {
    return this.privResult;
  }
}
class SpeechSynthesisWordBoundaryEventArgs {
  constructor(audioOffset, duration, text, wordLength, textOffset, boundaryType) {
    this.privAudioOffset = audioOffset;
    this.privDuration = duration;
    this.privText = text;
    this.privWordLength = wordLength;
    this.privTextOffset = textOffset;
    this.privBoundaryType = boundaryType;
  }
  get audioOffset() {
    return this.privAudioOffset;
  }
  get duration() {
    return this.privDuration;
  }
  get text() {
    return this.privText;
  }
  get wordLength() {
    return this.privWordLength;
  }
  get textOffset() {
    return this.privTextOffset;
  }
  get boundaryType() {
    return this.privBoundaryType;
  }
}
class SpeechSynthesisBookmarkEventArgs {
  constructor(audioOffset, text) {
    this.privAudioOffset = audioOffset;
    this.privText = text;
  }
  get audioOffset() {
    return this.privAudioOffset;
  }
  get text() {
    return this.privText;
  }
}
class SpeechSynthesisVisemeEventArgs {
  constructor(audioOffset, visemeId, animation) {
    this.privAudioOffset = audioOffset;
    this.privVisemeId = visemeId;
    this.privAnimation = animation;
  }
  get audioOffset() {
    return this.privAudioOffset;
  }
  get visemeId() {
    return this.privVisemeId;
  }
  get animation() {
    return this.privAnimation;
  }
}
class SynthesisVoicesResult extends SynthesisResult {
  constructor(requestId, json, errorDetails) {
    if (Array.isArray(json)) {
      super(requestId, ResultReason.VoicesListRetrieved, void 0, new PropertyCollection());
      this.privVoices = [];
      for (const item of json) {
        this.privVoices.push(new VoiceInfo(item));
      }
    } else {
      super(requestId, ResultReason.Canceled, errorDetails ? errorDetails : "Error information unavailable", new PropertyCollection());
    }
  }
  get voices() {
    return this.privVoices;
  }
}
var SynthesisVoiceGender;
(function(SynthesisVoiceGender2) {
  SynthesisVoiceGender2[SynthesisVoiceGender2["Unknown"] = 0] = "Unknown";
  SynthesisVoiceGender2[SynthesisVoiceGender2["Female"] = 1] = "Female";
  SynthesisVoiceGender2[SynthesisVoiceGender2["Male"] = 2] = "Male";
})(SynthesisVoiceGender || (SynthesisVoiceGender = {}));
var SynthesisVoiceType;
(function(SynthesisVoiceType2) {
  SynthesisVoiceType2[SynthesisVoiceType2["OnlineNeural"] = 1] = "OnlineNeural";
  SynthesisVoiceType2[SynthesisVoiceType2["OnlineStandard"] = 2] = "OnlineStandard";
  SynthesisVoiceType2[SynthesisVoiceType2["OfflineNeural"] = 3] = "OfflineNeural";
  SynthesisVoiceType2[SynthesisVoiceType2["OfflineStandard"] = 4] = "OfflineStandard";
})(SynthesisVoiceType || (SynthesisVoiceType = {}));
class VoiceInfo {
  constructor(json) {
    this.privStyleList = [];
    this.privVoicePath = "";
    if (!!json) {
      this.privName = json.Name;
      this.privLocale = json.Locale;
      this.privShortName = json.ShortName;
      this.privLocalName = json.LocalName;
      this.privVoiceType = json.VoiceType.endsWith("Standard") ? SynthesisVoiceType.OnlineStandard : SynthesisVoiceType.OnlineNeural;
      this.privGender = json.Gender === "Male" ? SynthesisVoiceGender.Male : json.Gender === "Female" ? SynthesisVoiceGender.Female : SynthesisVoiceGender.Unknown;
      if (!!json.StyleList && Array.isArray(json.StyleList)) {
        for (const style of json.StyleList) {
          this.privStyleList.push(style);
        }
      }
    }
  }
  get name() {
    return this.privName;
  }
  get locale() {
    return this.privLocale;
  }
  get shortName() {
    return this.privShortName;
  }
  get localName() {
    return this.privLocalName;
  }
  get gender() {
    return this.privGender;
  }
  get voiceType() {
    return this.privVoiceType;
  }
  get styleList() {
    return this.privStyleList;
  }
  get voicePath() {
    return this.privVoicePath;
  }
}
var __awaiter$8 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const MediaDurationPlaceholderSeconds = 60 * 30;
const AudioFormatToMimeType = {
  [AudioFormatTag.PCM]: "audio/wav",
  [AudioFormatTag.MuLaw]: "audio/x-wav",
  [AudioFormatTag.MP3]: "audio/mpeg",
  [AudioFormatTag.OGG_OPUS]: "audio/ogg",
  [AudioFormatTag.WEBM_OPUS]: "audio/webm; codecs=opus",
  [AudioFormatTag.ALaw]: "audio/x-wav",
  [AudioFormatTag.FLAC]: "audio/flac"
};
class SpeakerAudioDestination {
  constructor(audioDestinationId) {
    this.privPlaybackStarted = false;
    this.privAppendingToBuffer = false;
    this.privMediaSourceOpened = false;
    this.privBytesReceived = 0;
    this.privId = audioDestinationId ? audioDestinationId : createNoDashGuid();
    this.privIsPaused = false;
    this.privIsClosed = false;
  }
  id() {
    return this.privId;
  }
  write(buffer, cb, err) {
    if (this.privAudioBuffer !== void 0) {
      this.privAudioBuffer.push(buffer);
      this.updateSourceBuffer().then(() => {
        if (!!cb) {
          cb();
        }
      }, (error) => {
        if (!!err) {
          err(error);
        }
      });
    } else if (this.privAudioOutputStream !== void 0) {
      this.privAudioOutputStream.write(buffer);
      this.privBytesReceived += buffer.byteLength;
    }
  }
  close(cb, err) {
    this.privIsClosed = true;
    if (this.privSourceBuffer !== void 0) {
      this.handleSourceBufferUpdateEnd().then(() => {
        if (!!cb) {
          cb();
        }
      }, (error) => {
        if (!!err) {
          err(error);
        }
      });
    } else if (this.privAudioOutputStream !== void 0 && typeof window !== "undefined") {
      if ((this.privFormat.formatTag === AudioFormatTag.PCM || this.privFormat.formatTag === AudioFormatTag.MuLaw || this.privFormat.formatTag === AudioFormatTag.ALaw) && this.privFormat.hasHeader === false) {
        console.warn("Play back is not supported for raw PCM, mulaw or alaw format without header.");
        if (!!this.onAudioEnd) {
          this.onAudioEnd(this);
        }
      } else {
        let receivedAudio = new ArrayBuffer(this.privBytesReceived);
        this.privAudioOutputStream.read(receivedAudio).then(() => {
          receivedAudio = SynthesisAdapterBase.addHeader(receivedAudio, this.privFormat);
          const audioBlob = new Blob([receivedAudio], { type: AudioFormatToMimeType[this.privFormat.formatTag] });
          this.privAudio.src = window.URL.createObjectURL(audioBlob);
          this.notifyPlayback().then(() => {
            if (!!cb) {
              cb();
            }
          }, (error) => {
            if (!!err) {
              err(error);
            }
          });
        }, (error) => {
          if (!!err) {
            err(error);
          }
        });
      }
    } else {
      if (!!this.onAudioEnd) {
        this.onAudioEnd(this);
      }
    }
  }
  set format(format) {
    if (typeof AudioContext !== "undefined" || typeof window !== "undefined" && typeof window.webkitAudioContext !== "undefined") {
      this.privFormat = format;
      const mimeType = AudioFormatToMimeType[this.privFormat.formatTag];
      if (mimeType === void 0) {
        console.warn(`Unknown mimeType for format ${AudioFormatTag[this.privFormat.formatTag]}; playback is not supported.`);
      } else if (typeof MediaSource !== "undefined" && MediaSource.isTypeSupported(mimeType)) {
        this.privAudio = new Audio();
        this.privAudioBuffer = [];
        this.privMediaSource = new MediaSource();
        this.privAudio.src = URL.createObjectURL(this.privMediaSource);
        this.privAudio.load();
        this.privMediaSource.onsourceopen = () => {
          this.privMediaSourceOpened = true;
          this.privMediaSource.duration = MediaDurationPlaceholderSeconds;
          this.privSourceBuffer = this.privMediaSource.addSourceBuffer(mimeType);
          this.privSourceBuffer.onupdate = () => {
            this.updateSourceBuffer().catch((reason) => {
              Events.instance.onEvent(new BackgroundEvent(reason));
            });
          };
          this.privSourceBuffer.onupdateend = () => {
            this.handleSourceBufferUpdateEnd().catch((reason) => {
              Events.instance.onEvent(new BackgroundEvent(reason));
            });
          };
          this.privSourceBuffer.onupdatestart = () => {
            this.privAppendingToBuffer = false;
          };
        };
        this.updateSourceBuffer().catch((reason) => {
          Events.instance.onEvent(new BackgroundEvent(reason));
        });
      } else {
        console.warn(`Format ${AudioFormatTag[this.privFormat.formatTag]} could not be played by MSE, streaming playback is not enabled.`);
        this.privAudioOutputStream = new PullAudioOutputStreamImpl();
        this.privAudioOutputStream.format = this.privFormat;
        this.privAudio = new Audio();
      }
    }
  }
  get volume() {
    var _a, _b;
    return (_b = (_a = this.privAudio) === null || _a === void 0 ? void 0 : _a.volume) !== null && _b !== void 0 ? _b : -1;
  }
  set volume(volume) {
    if (!!this.privAudio) {
      this.privAudio.volume = volume;
    }
  }
  mute() {
    if (!!this.privAudio) {
      this.privAudio.muted = true;
    }
  }
  unmute() {
    if (!!this.privAudio) {
      this.privAudio.muted = false;
    }
  }
  get isClosed() {
    return this.privIsClosed;
  }
  get currentTime() {
    if (this.privAudio !== void 0) {
      return this.privAudio.currentTime;
    }
    return -1;
  }
  pause() {
    if (!this.privIsPaused && this.privAudio !== void 0) {
      this.privAudio.pause();
      this.privIsPaused = true;
    }
  }
  resume(cb, err) {
    if (this.privIsPaused && this.privAudio !== void 0) {
      this.privAudio.play().then(() => {
        if (!!cb) {
          cb();
        }
      }, (error) => {
        if (!!err) {
          err(error);
        }
      });
      this.privIsPaused = false;
    }
  }
  get internalAudio() {
    return this.privAudio;
  }
  updateSourceBuffer() {
    return __awaiter$8(this, void 0, void 0, function* () {
      if (this.privAudioBuffer !== void 0 && this.privAudioBuffer.length > 0 && this.sourceBufferAvailable()) {
        this.privAppendingToBuffer = true;
        const binary = this.privAudioBuffer.shift();
        try {
          this.privSourceBuffer.appendBuffer(binary);
        } catch (error) {
          this.privAudioBuffer.unshift(binary);
          console.log("buffer filled, pausing addition of binaries until space is made");
          return;
        }
        yield this.notifyPlayback();
      } else if (this.canEndStream()) {
        yield this.handleSourceBufferUpdateEnd();
      }
    });
  }
  handleSourceBufferUpdateEnd() {
    return __awaiter$8(this, void 0, void 0, function* () {
      if (this.canEndStream() && this.sourceBufferAvailable()) {
        this.privMediaSource.endOfStream();
        yield this.notifyPlayback();
      }
    });
  }
  notifyPlayback() {
    return __awaiter$8(this, void 0, void 0, function* () {
      if (!this.privPlaybackStarted && this.privAudio !== void 0) {
        this.privPlaybackStarted = true;
        if (!!this.onAudioStart) {
          this.onAudioStart(this);
        }
        this.privAudio.onended = () => {
          if (!!this.onAudioEnd) {
            this.onAudioEnd(this);
          }
        };
        if (!this.privIsPaused) {
          yield this.privAudio.play();
        }
      }
    });
  }
  canEndStream() {
    return this.isClosed && this.privSourceBuffer !== void 0 && this.privAudioBuffer.length === 0 && this.privMediaSourceOpened && !this.privAppendingToBuffer && this.privMediaSource.readyState === "open";
  }
  sourceBufferAvailable() {
    return this.privSourceBuffer !== void 0 && !this.privSourceBuffer.updating;
  }
}
class SpeechConnectionMessage extends ConnectionMessage {
  constructor(messageType, path, requestId, contentType, body, streamId, additionalHeaders, id) {
    if (!path) {
      throw new ArgumentNullError("path");
    }
    if (!requestId) {
      throw new ArgumentNullError("requestId");
    }
    const headers = {};
    headers[HeaderNames.Path] = path;
    headers[HeaderNames.RequestId] = requestId;
    headers[HeaderNames.RequestTimestamp] = new Date().toISOString();
    if (contentType) {
      headers[HeaderNames.ContentType] = contentType;
    }
    if (streamId) {
      headers[HeaderNames.RequestStreamId] = streamId;
    }
    if (additionalHeaders) {
      for (const headerName in additionalHeaders) {
        if (headerName) {
          headers[headerName] = additionalHeaders[headerName];
        }
      }
    }
    if (id) {
      super(messageType, body, headers, id);
    } else {
      super(messageType, body, headers);
    }
    this.privPath = path;
    this.privRequestId = requestId;
    this.privContentType = contentType;
    this.privStreamId = streamId;
    this.privAdditionalHeaders = additionalHeaders;
  }
  get path() {
    return this.privPath;
  }
  get requestId() {
    return this.privRequestId;
  }
  get contentType() {
    return this.privContentType;
  }
  get streamId() {
    return this.privStreamId;
  }
  get additionalHeaders() {
    return this.privAdditionalHeaders;
  }
  static fromConnectionMessage(message) {
    let path = null;
    let requestId = null;
    let contentType = null;
    let streamId = null;
    const additionalHeaders = {};
    if (message.headers) {
      for (const headerName in message.headers) {
        if (headerName) {
          if (headerName.toLowerCase() === HeaderNames.Path.toLowerCase()) {
            path = message.headers[headerName];
          } else if (headerName.toLowerCase() === HeaderNames.RequestId.toLowerCase()) {
            requestId = message.headers[headerName];
          } else if (headerName.toLowerCase() === HeaderNames.ContentType.toLowerCase()) {
            contentType = message.headers[headerName];
          } else if (headerName.toLowerCase() === HeaderNames.RequestStreamId.toLowerCase()) {
            streamId = message.headers[headerName];
          } else {
            additionalHeaders[headerName] = message.headers[headerName];
          }
        }
      }
    }
    return new SpeechConnectionMessage(message.messageType, path, requestId, contentType, message.body, streamId, additionalHeaders, message.id);
  }
}
var RecognitionMode;
(function(RecognitionMode2) {
  RecognitionMode2[RecognitionMode2["Interactive"] = 0] = "Interactive";
  RecognitionMode2[RecognitionMode2["Conversation"] = 1] = "Conversation";
  RecognitionMode2[RecognitionMode2["Dictation"] = 2] = "Dictation";
})(RecognitionMode || (RecognitionMode = {}));
var SpeechResultFormat;
(function(SpeechResultFormat2) {
  SpeechResultFormat2[SpeechResultFormat2["Simple"] = 0] = "Simple";
  SpeechResultFormat2[SpeechResultFormat2["Detailed"] = 1] = "Detailed";
})(SpeechResultFormat || (SpeechResultFormat = {}));
class SpeechServiceConfig {
  constructor(context) {
    this.context = context;
  }
  serialize() {
    return JSON.stringify(this, (key, value) => {
      if (value && typeof value === "object") {
        const replacement = {};
        for (const k in value) {
          if (Object.hasOwnProperty.call(value, k)) {
            replacement[k && k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
          }
        }
        return replacement;
      }
      return value;
    });
  }
  get Context() {
    return this.context;
  }
  get Recognition() {
    return this.recognition;
  }
  set Recognition(value) {
    this.recognition = value.toLowerCase();
  }
}
class Context {
  constructor(os) {
    this.system = new System();
    this.os = os;
  }
}
class System {
  constructor() {
    const SPEECHSDK_CLIENTSDK_VERSION = "1.22.0";
    this.name = "SpeechSDK";
    this.version = SPEECHSDK_CLIENTSDK_VERSION;
    this.build = "JavaScript";
    this.lang = "JavaScript";
  }
}
class OS {
  constructor(platform, name, version) {
    this.platform = platform;
    this.name = name;
    this.version = version;
  }
}
var connectivity;
(function(connectivity2) {
  connectivity2["Bluetooth"] = "Bluetooth";
  connectivity2["Wired"] = "Wired";
  connectivity2["WiFi"] = "WiFi";
  connectivity2["Cellular"] = "Cellular";
  connectivity2["InBuilt"] = "InBuilt";
  connectivity2["Unknown"] = "Unknown";
})(connectivity || (connectivity = {}));
var type;
(function(type2) {
  type2["Phone"] = "Phone";
  type2["Speaker"] = "Speaker";
  type2["Car"] = "Car";
  type2["Headset"] = "Headset";
  type2["Thermostat"] = "Thermostat";
  type2["Microphones"] = "Microphones";
  type2["Deskphone"] = "Deskphone";
  type2["RemoteControl"] = "RemoteControl";
  type2["Unknown"] = "Unknown";
  type2["File"] = "File";
  type2["Stream"] = "Stream";
})(type || (type = {}));
const CRLF = "\r\n";
class WebsocketMessageFormatter {
  toConnectionMessage(message) {
    const deferral = new Deferred();
    try {
      if (message.messageType === MessageType.Text) {
        const textMessage = message.textContent;
        let headers = {};
        let body = null;
        if (textMessage) {
          const headerBodySplit = textMessage.split("\r\n\r\n");
          if (headerBodySplit && headerBodySplit.length > 0) {
            headers = this.parseHeaders(headerBodySplit[0]);
            if (headerBodySplit.length > 1) {
              body = headerBodySplit[1];
            }
          }
        }
        deferral.resolve(new ConnectionMessage(message.messageType, body, headers, message.id));
      } else if (message.messageType === MessageType.Binary) {
        const binaryMessage = message.binaryContent;
        let headers = {};
        let body = null;
        if (!binaryMessage || binaryMessage.byteLength < 2) {
          throw new Error("Invalid binary message format. Header length missing.");
        }
        const dataView = new DataView(binaryMessage);
        const headerLength = dataView.getInt16(0);
        if (binaryMessage.byteLength < headerLength + 2) {
          throw new Error("Invalid binary message format. Header content missing.");
        }
        let headersString = "";
        for (let i = 0; i < headerLength; i++) {
          headersString += String.fromCharCode(dataView.getInt8(i + 2));
        }
        headers = this.parseHeaders(headersString);
        if (binaryMessage.byteLength > headerLength + 2) {
          body = binaryMessage.slice(2 + headerLength);
        }
        deferral.resolve(new ConnectionMessage(message.messageType, body, headers, message.id));
      }
    } catch (e) {
      deferral.reject(`Error formatting the message. Error: ${e}`);
    }
    return deferral.promise;
  }
  fromConnectionMessage(message) {
    const deferral = new Deferred();
    try {
      if (message.messageType === MessageType.Text) {
        const payload = `${this.makeHeaders(message)}${CRLF}${message.textBody ? message.textBody : ""}`;
        deferral.resolve(new RawWebsocketMessage(MessageType.Text, payload, message.id));
      } else if (message.messageType === MessageType.Binary) {
        const headersString = this.makeHeaders(message);
        const content = message.binaryBody;
        const headerBuffer = this.stringToArrayBuffer(headersString);
        const headerInt8Array = new Int8Array(headerBuffer);
        const headerLength = headerInt8Array.byteLength;
        const payloadInt8Array = new Int8Array(2 + headerLength + (content ? content.byteLength : 0));
        payloadInt8Array[0] = headerLength >> 8 & 255;
        payloadInt8Array[1] = headerLength & 255;
        payloadInt8Array.set(headerInt8Array, 2);
        if (content) {
          const bodyInt8Array = new Int8Array(content);
          payloadInt8Array.set(bodyInt8Array, 2 + headerLength);
        }
        const payload = payloadInt8Array.buffer;
        deferral.resolve(new RawWebsocketMessage(MessageType.Binary, payload, message.id));
      }
    } catch (e) {
      deferral.reject(`Error formatting the message. ${e}`);
    }
    return deferral.promise;
  }
  makeHeaders(message) {
    let headersString = "";
    if (message.headers) {
      for (const header in message.headers) {
        if (header) {
          headersString += `${header}: ${message.headers[header]}${CRLF}`;
        }
      }
    }
    return headersString;
  }
  parseHeaders(headersString) {
    const headers = {};
    if (headersString) {
      const headerMatches = headersString.match(/[^\r\n]+/g);
      if (headers) {
        for (const header of headerMatches) {
          if (header) {
            const separatorIndex = header.indexOf(":");
            const headerName = separatorIndex > 0 ? header.substr(0, separatorIndex).trim().toLowerCase() : header;
            const headerValue = separatorIndex > 0 && header.length > separatorIndex + 1 ? header.substr(separatorIndex + 1).trim() : "";
            headers[headerName] = headerValue;
          }
        }
      }
    }
    return headers;
  }
  stringToArrayBuffer(str) {
    const buffer = new ArrayBuffer(str.length);
    const view = new DataView(buffer);
    for (let i = 0; i < str.length; i++) {
      view.setUint8(i, str.charCodeAt(i));
    }
    return buffer;
  }
}
class SpeechSynthesisConnectionFactory {
  constructor() {
    this.synthesisUri = "/cognitiveservices/websocket/v1";
  }
  create(config, authInfo, connectionId) {
    let endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Endpoint, void 0);
    const region = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Region, void 0);
    const hostSuffix = ConnectionFactoryBase.getHostSuffix(region);
    const endpointId = config.parameters.getProperty(PropertyId.SpeechServiceConnection_EndpointId, void 0);
    const hostPrefix = endpointId === void 0 ? "tts" : "voice";
    const host = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Host, "wss://" + region + "." + hostPrefix + ".speech" + hostSuffix);
    const queryParams = {};
    if (!endpoint) {
      endpoint = host + this.synthesisUri;
    }
    const headers = {};
    if (authInfo.token !== void 0 && authInfo.token !== "") {
      headers[authInfo.headerName] = authInfo.token;
    }
    headers[HeaderNames.ConnectionId] = connectionId;
    if (endpointId !== void 0) {
      headers[QueryParameterNames.CustomVoiceDeploymentId] = endpointId;
    }
    config.parameters.setProperty(PropertyId.SpeechServiceConnection_Url, endpoint);
    const enableCompression = config.parameters.getProperty("SPEECH-EnableWebsocketCompression", "false") === "true";
    return new WebsocketConnection(endpoint, queryParams, headers, new WebsocketMessageFormatter(), ProxyInfo.fromParameters(config.parameters), enableCompression, connectionId);
  }
}
class AgentConfig {
  toJsonString() {
    return JSON.stringify(this.iPrivConfig);
  }
  get() {
    return this.iPrivConfig;
  }
  set(value) {
    this.iPrivConfig = value;
  }
}
class RestConfigBase {
  static get requestOptions() {
    return RestConfigBase.privDefaultRequestOptions;
  }
  static get configParams() {
    return RestConfigBase.privDefaultParams;
  }
  static get restErrors() {
    return RestConfigBase.privRestErrors;
  }
}
RestConfigBase.privDefaultRequestOptions = {
  headers: {
    Accept: "application/json"
  },
  ignoreCache: false,
  timeout: 1e4
};
RestConfigBase.privRestErrors = {
  authInvalidSubscriptionKey: "You must specify either an authentication token to use, or a Cognitive Speech subscription key.",
  authInvalidSubscriptionRegion: "You must specify the Cognitive Speech region to use.",
  invalidArgs: "Required input not found: {arg}.",
  invalidCreateJoinConversationResponse: "Creating/Joining conversation failed with HTTP {status}.",
  invalidParticipantRequest: "The requested participant was not found.",
  permissionDeniedConnect: "Required credentials not found.",
  permissionDeniedConversation: "Invalid operation: only the host can {command} the conversation.",
  permissionDeniedParticipant: "Invalid operation: only the host can {command} a participant.",
  permissionDeniedSend: "Invalid operation: the conversation is not in a connected state.",
  permissionDeniedStart: "Invalid operation: there is already an active conversation."
};
RestConfigBase.privDefaultParams = {
  apiVersion: "api-version",
  authorization: "Authorization",
  clientAppId: "X-ClientAppId",
  contentTypeKey: "Content-Type",
  correlationId: "X-CorrelationId",
  languageCode: "language",
  nickname: "nickname",
  profanity: "profanity",
  requestId: "X-RequestId",
  roomId: "roomid",
  sessionToken: "token",
  subscriptionKey: "Ocp-Apim-Subscription-Key",
  subscriptionRegion: "Ocp-Apim-Subscription-Region",
  token: "X-CapitoToken"
};
var MetadataType;
(function(MetadataType2) {
  MetadataType2["WordBoundary"] = "WordBoundary";
  MetadataType2["Bookmark"] = "Bookmark";
  MetadataType2["Viseme"] = "Viseme";
  MetadataType2["SentenceBoundary"] = "SentenceBoundary";
  MetadataType2["SessionEnd"] = "SessionEnd";
})(MetadataType || (MetadataType = {}));
class SynthesisAudioMetadata {
  constructor(json) {
    this.privSynthesisAudioMetadata = JSON.parse(json);
  }
  static fromJSON(json) {
    return new SynthesisAudioMetadata(json);
  }
  get Metadata() {
    return this.privSynthesisAudioMetadata.Metadata;
  }
}
var __awaiter$7 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class SynthesisAdapterBase {
  constructor(authentication, connectionFactory, synthesizerConfig, speechSynthesizer, audioDestination) {
    this.speakOverride = void 0;
    this.receiveMessageOverride = void 0;
    this.connectImplOverride = void 0;
    this.configConnectionOverride = void 0;
    this.privConnectionConfigurationPromise = void 0;
    if (!authentication) {
      throw new ArgumentNullError("authentication");
    }
    if (!connectionFactory) {
      throw new ArgumentNullError("connectionFactory");
    }
    if (!synthesizerConfig) {
      throw new ArgumentNullError("synthesizerConfig");
    }
    this.privAuthentication = authentication;
    this.privConnectionFactory = connectionFactory;
    this.privSynthesizerConfig = synthesizerConfig;
    this.privIsDisposed = false;
    this.privSpeechSynthesizer = speechSynthesizer;
    this.privSessionAudioDestination = audioDestination;
    this.privSynthesisTurn = new SynthesisTurn();
    this.privConnectionEvents = new EventSource();
    this.privServiceEvents = new EventSource();
    this.privSynthesisContext = new SynthesisContext(this.privSpeechSynthesizer);
    this.privAgentConfig = new AgentConfig();
    this.connectionEvents.attach((connectionEvent) => {
      if (connectionEvent.name === "ConnectionClosedEvent") {
        const connectionClosedEvent = connectionEvent;
        if (connectionClosedEvent.statusCode !== 1e3) {
          this.cancelSynthesisLocal(CancellationReason.Error, connectionClosedEvent.statusCode === 1007 ? CancellationErrorCode.BadRequestParameters : CancellationErrorCode.ConnectionFailure, `${connectionClosedEvent.reason} websocket error code: ${connectionClosedEvent.statusCode}`);
        }
      }
    });
  }
  get synthesisContext() {
    return this.privSynthesisContext;
  }
  get agentConfig() {
    return this.privAgentConfig;
  }
  get connectionEvents() {
    return this.privConnectionEvents;
  }
  get serviceEvents() {
    return this.privServiceEvents;
  }
  set activityTemplate(messagePayload) {
    this.privActivityTemplate = messagePayload;
  }
  get activityTemplate() {
    return this.privActivityTemplate;
  }
  set audioOutputFormat(format) {
    this.privAudioOutputFormat = format;
    this.privSynthesisTurn.audioOutputFormat = format;
    if (this.privSessionAudioDestination !== void 0) {
      this.privSessionAudioDestination.format = format;
    }
    if (this.synthesisContext !== void 0) {
      this.synthesisContext.audioOutputFormat = format;
    }
  }
  static addHeader(audio, format) {
    if (!format.hasHeader) {
      return audio;
    }
    format.updateHeader(audio.byteLength);
    const tmp = new Uint8Array(audio.byteLength + format.header.byteLength);
    tmp.set(new Uint8Array(format.header), 0);
    tmp.set(new Uint8Array(audio), format.header.byteLength);
    return tmp.buffer;
  }
  isDisposed() {
    return this.privIsDisposed;
  }
  dispose(reason) {
    return __awaiter$7(this, void 0, void 0, function* () {
      this.privIsDisposed = true;
      if (this.privSessionAudioDestination !== void 0) {
        this.privSessionAudioDestination.close();
      }
      if (this.privConnectionConfigurationPromise !== void 0) {
        const connection = yield this.privConnectionConfigurationPromise;
        yield connection.dispose(reason);
      }
    });
  }
  connect() {
    return __awaiter$7(this, void 0, void 0, function* () {
      yield this.connectImpl();
    });
  }
  sendNetworkMessage(path, payload) {
    return __awaiter$7(this, void 0, void 0, function* () {
      const type2 = typeof payload === "string" ? MessageType.Text : MessageType.Binary;
      const contentType = typeof payload === "string" ? "application/json" : "";
      const connection = yield this.fetchConnection();
      return connection.send(new SpeechConnectionMessage(type2, path, this.privSynthesisTurn.requestId, contentType, payload));
    });
  }
  Speak(text, isSSML, requestId, successCallback, errorCallBack, audioDestination) {
    return __awaiter$7(this, void 0, void 0, function* () {
      let ssml;
      if (isSSML) {
        ssml = text;
      } else {
        ssml = this.privSpeechSynthesizer.buildSsml(text);
      }
      if (this.speakOverride !== void 0) {
        return this.speakOverride(ssml, requestId, successCallback, errorCallBack);
      }
      this.privSuccessCallback = successCallback;
      this.privErrorCallback = errorCallBack;
      this.privSynthesisTurn.startNewSynthesis(requestId, text, isSSML, audioDestination);
      try {
        yield this.connectImpl();
        const connection = yield this.fetchConnection();
        yield this.sendSynthesisContext(connection);
        yield this.sendSsmlMessage(connection, ssml, requestId);
        const synthesisStartEventArgs = new SpeechSynthesisEventArgs(new SpeechSynthesisResult(requestId, ResultReason.SynthesizingAudioStarted));
        if (!!this.privSpeechSynthesizer.synthesisStarted) {
          this.privSpeechSynthesizer.synthesisStarted(this.privSpeechSynthesizer, synthesisStartEventArgs);
        }
        void this.receiveMessage();
      } catch (e) {
        this.cancelSynthesisLocal(CancellationReason.Error, CancellationErrorCode.ConnectionFailure, e);
        return Promise.reject(e);
      }
    });
  }
  cancelSynthesis(requestId, cancellationReason, errorCode, error) {
    const properties = new PropertyCollection();
    properties.setProperty(CancellationErrorCodePropertyName, CancellationErrorCode[errorCode]);
    const result = new SpeechSynthesisResult(requestId, ResultReason.Canceled, void 0, error, properties);
    if (!!this.privSpeechSynthesizer.SynthesisCanceled) {
      const cancelEvent = new SpeechSynthesisEventArgs(result);
      try {
        this.privSpeechSynthesizer.SynthesisCanceled(this.privSpeechSynthesizer, cancelEvent);
      } catch (_a) {
      }
    }
    if (!!this.privSuccessCallback) {
      try {
        this.privSuccessCallback(result);
      } catch (_b) {
      }
    }
  }
  cancelSynthesisLocal(cancellationReason, errorCode, error) {
    if (!!this.privSynthesisTurn.isSynthesizing) {
      this.privSynthesisTurn.onStopSynthesizing();
      this.cancelSynthesis(this.privSynthesisTurn.requestId, cancellationReason, errorCode, error);
    }
  }
  processTypeSpecificMessages(connectionMessage) {
    return true;
  }
  receiveMessage() {
    return __awaiter$7(this, void 0, void 0, function* () {
      try {
        const connection = yield this.fetchConnection();
        const message = yield connection.read();
        if (this.receiveMessageOverride !== void 0) {
          return this.receiveMessageOverride();
        }
        if (this.privIsDisposed) {
          return;
        }
        if (!message) {
          if (!this.privSynthesisTurn.isSynthesizing) {
            return;
          } else {
            return this.receiveMessage();
          }
        }
        const connectionMessage = SpeechConnectionMessage.fromConnectionMessage(message);
        if (connectionMessage.requestId.toLowerCase() === this.privSynthesisTurn.requestId.toLowerCase()) {
          switch (connectionMessage.path.toLowerCase()) {
            case "turn.start":
              this.privSynthesisTurn.onServiceTurnStartResponse();
              break;
            case "response":
              this.privSynthesisTurn.onServiceResponseMessage(connectionMessage.textBody);
              break;
            case "audio":
              if (this.privSynthesisTurn.streamId.toLowerCase() === connectionMessage.streamId.toLowerCase() && !!connectionMessage.binaryBody) {
                this.privSynthesisTurn.onAudioChunkReceived(connectionMessage.binaryBody);
                if (!!this.privSpeechSynthesizer.synthesizing) {
                  try {
                    const audioWithHeader = SynthesisAdapterBase.addHeader(connectionMessage.binaryBody, this.privSynthesisTurn.audioOutputFormat);
                    const ev = new SpeechSynthesisEventArgs(new SpeechSynthesisResult(this.privSynthesisTurn.requestId, ResultReason.SynthesizingAudio, audioWithHeader));
                    this.privSpeechSynthesizer.synthesizing(this.privSpeechSynthesizer, ev);
                  } catch (error) {
                  }
                }
                if (this.privSessionAudioDestination !== void 0) {
                  this.privSessionAudioDestination.write(connectionMessage.binaryBody);
                }
              }
              break;
            case "audio.metadata":
              const metadataList = SynthesisAudioMetadata.fromJSON(connectionMessage.textBody).Metadata;
              for (const metadata of metadataList) {
                switch (metadata.Type) {
                  case MetadataType.WordBoundary:
                  case MetadataType.SentenceBoundary:
                    this.privSynthesisTurn.onTextBoundaryEvent(metadata);
                    const wordBoundaryEventArgs = new SpeechSynthesisWordBoundaryEventArgs(metadata.Data.Offset, metadata.Data.Duration, metadata.Data.text.Text, metadata.Data.text.Length, metadata.Type === MetadataType.WordBoundary ? this.privSynthesisTurn.currentTextOffset : this.privSynthesisTurn.currentSentenceOffset, metadata.Data.text.BoundaryType);
                    if (!!this.privSpeechSynthesizer.wordBoundary) {
                      try {
                        this.privSpeechSynthesizer.wordBoundary(this.privSpeechSynthesizer, wordBoundaryEventArgs);
                      } catch (error) {
                      }
                    }
                    break;
                  case MetadataType.Bookmark:
                    const bookmarkEventArgs = new SpeechSynthesisBookmarkEventArgs(metadata.Data.Offset, metadata.Data.Bookmark);
                    if (!!this.privSpeechSynthesizer.bookmarkReached) {
                      try {
                        this.privSpeechSynthesizer.bookmarkReached(this.privSpeechSynthesizer, bookmarkEventArgs);
                      } catch (error) {
                      }
                    }
                    break;
                  case MetadataType.Viseme:
                    this.privSynthesisTurn.onVisemeMetadataReceived(metadata);
                    if (metadata.Data.IsLastAnimation) {
                      const visemeEventArgs = new SpeechSynthesisVisemeEventArgs(metadata.Data.Offset, metadata.Data.VisemeId, this.privSynthesisTurn.getAndClearVisemeAnimation());
                      if (!!this.privSpeechSynthesizer.visemeReceived) {
                        try {
                          this.privSpeechSynthesizer.visemeReceived(this.privSpeechSynthesizer, visemeEventArgs);
                        } catch (error) {
                        }
                      }
                    }
                    break;
                  case MetadataType.SessionEnd:
                    this.privSynthesisTurn.onSessionEnd(metadata);
                    break;
                }
              }
              break;
            case "turn.end":
              this.privSynthesisTurn.onServiceTurnEndResponse();
              let result;
              try {
                const audioBuffer = yield this.privSynthesisTurn.getAllReceivedAudioWithHeader();
                result = new SpeechSynthesisResult(this.privSynthesisTurn.requestId, ResultReason.SynthesizingAudioCompleted, audioBuffer, void 0, void 0, this.privSynthesisTurn.audioDuration);
                if (!!this.privSuccessCallback) {
                  this.privSuccessCallback(result);
                }
              } catch (error) {
                if (!!this.privErrorCallback) {
                  this.privErrorCallback(error);
                }
              }
              if (this.privSpeechSynthesizer.synthesisCompleted) {
                try {
                  this.privSpeechSynthesizer.synthesisCompleted(this.privSpeechSynthesizer, new SpeechSynthesisEventArgs(result));
                } catch (e) {
                }
              }
              break;
            default:
              if (!this.processTypeSpecificMessages(connectionMessage)) {
                if (!!this.privServiceEvents) {
                  this.serviceEvents.onEvent(new ServiceEvent(connectionMessage.path.toLowerCase(), connectionMessage.textBody));
                }
              }
          }
        }
        return this.receiveMessage();
      } catch (e) {
      }
    });
  }
  sendSynthesisContext(connection) {
    const synthesisContextJson = this.synthesisContext.toJSON();
    if (synthesisContextJson) {
      return connection.send(new SpeechConnectionMessage(MessageType.Text, "synthesis.context", this.privSynthesisTurn.requestId, "application/json", synthesisContextJson));
    }
    return;
  }
  connectImpl(isUnAuthorized = false) {
    if (this.privConnectionPromise != null) {
      return this.privConnectionPromise.then((connection) => {
        if (connection.state() === ConnectionState.Disconnected) {
          this.privConnectionId = null;
          this.privConnectionPromise = null;
          return this.connectImpl();
        }
        return this.privConnectionPromise;
      }, () => {
        this.privConnectionId = null;
        this.privConnectionPromise = null;
        return this.connectImpl();
      });
    }
    this.privAuthFetchEventId = createNoDashGuid();
    this.privConnectionId = createNoDashGuid();
    this.privSynthesisTurn.onPreConnectionStart(this.privAuthFetchEventId);
    const authPromise = isUnAuthorized ? this.privAuthentication.fetchOnExpiry(this.privAuthFetchEventId) : this.privAuthentication.fetch(this.privAuthFetchEventId);
    this.privConnectionPromise = authPromise.then((result) => __awaiter$7(this, void 0, void 0, function* () {
      this.privSynthesisTurn.onAuthCompleted(false);
      const connection = this.privConnectionFactory.create(this.privSynthesizerConfig, result, this.privConnectionId);
      connection.events.attach((event) => {
        this.connectionEvents.onEvent(event);
      });
      const response = yield connection.open();
      if (response.statusCode === 200) {
        this.privSynthesisTurn.onConnectionEstablishCompleted(response.statusCode);
        return Promise.resolve(connection);
      } else if (response.statusCode === 403 && !isUnAuthorized) {
        return this.connectImpl(true);
      } else {
        this.privSynthesisTurn.onConnectionEstablishCompleted(response.statusCode);
        return Promise.reject(`Unable to contact server. StatusCode: ${response.statusCode}, ${this.privSynthesizerConfig.parameters.getProperty(PropertyId.SpeechServiceConnection_Endpoint)} Reason: ${response.reason}`);
      }
    }), (error) => {
      this.privSynthesisTurn.onAuthCompleted(true);
      throw new Error(error);
    });
    this.privConnectionPromise.catch(() => {
    });
    return this.privConnectionPromise;
  }
  sendSpeechServiceConfig(connection, SpeechServiceConfigJson) {
    if (SpeechServiceConfigJson) {
      return connection.send(new SpeechConnectionMessage(MessageType.Text, "speech.config", this.privSynthesisTurn.requestId, "application/json", SpeechServiceConfigJson));
    }
  }
  sendSsmlMessage(connection, ssml, requestId) {
    return connection.send(new SpeechConnectionMessage(MessageType.Text, "ssml", requestId, "application/ssml+xml", ssml));
  }
  fetchConnection() {
    return __awaiter$7(this, void 0, void 0, function* () {
      if (this.privConnectionConfigurationPromise !== void 0) {
        return this.privConnectionConfigurationPromise.then((connection) => {
          if (connection.state() === ConnectionState.Disconnected) {
            this.privConnectionId = null;
            this.privConnectionConfigurationPromise = void 0;
            return this.fetchConnection();
          }
          return this.privConnectionConfigurationPromise;
        }, () => {
          this.privConnectionId = null;
          this.privConnectionConfigurationPromise = void 0;
          return this.fetchConnection();
        });
      }
      this.privConnectionConfigurationPromise = this.configureConnection();
      return yield this.privConnectionConfigurationPromise;
    });
  }
  configureConnection() {
    return __awaiter$7(this, void 0, void 0, function* () {
      const connection = yield this.connectImpl();
      if (this.configConnectionOverride !== void 0) {
        return this.configConnectionOverride(connection);
      }
      yield this.sendSpeechServiceConfig(connection, this.privSynthesizerConfig.SpeechServiceConfig.serialize());
      return connection;
    });
  }
}
SynthesisAdapterBase.telemetryDataEnabled = true;
class SpeechSynthesisEvent extends PlatformEvent {
  constructor(eventName, requestId, eventType = EventType.Info) {
    super(eventName, eventType);
    this.privRequestId = requestId;
  }
  get requestId() {
    return this.privRequestId;
  }
}
class SynthesisTriggeredEvent extends SpeechSynthesisEvent {
  constructor(requestId, sessionAudioDestinationId, turnAudioDestinationId) {
    super("SynthesisTriggeredEvent", requestId);
    this.privSessionAudioDestinationId = sessionAudioDestinationId;
    this.privTurnAudioDestinationId = turnAudioDestinationId;
  }
  get audioSessionDestinationId() {
    return this.privSessionAudioDestinationId;
  }
  get audioTurnDestinationId() {
    return this.privTurnAudioDestinationId;
  }
}
class ConnectingToSynthesisServiceEvent extends SpeechSynthesisEvent {
  constructor(requestId, authFetchEventId) {
    super("ConnectingToSynthesisServiceEvent", requestId);
    this.privAuthFetchEventId = authFetchEventId;
  }
  get authFetchEventId() {
    return this.privAuthFetchEventId;
  }
}
class SynthesisStartedEvent extends SpeechSynthesisEvent {
  constructor(requestId, authFetchEventId) {
    super("SynthesisStartedEvent", requestId);
    this.privAuthFetchEventId = authFetchEventId;
  }
  get authFetchEventId() {
    return this.privAuthFetchEventId;
  }
}
var __awaiter$6 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class SynthesisTurn {
  constructor() {
    this.privIsDisposed = false;
    this.privIsSynthesizing = false;
    this.privIsSynthesisEnded = false;
    this.privBytesReceived = 0;
    this.privInTurn = false;
    this.privTextOffset = 0;
    this.privNextSearchTextIndex = 0;
    this.privSentenceOffset = 0;
    this.privNextSearchSentenceIndex = 0;
    this.privRequestId = createNoDashGuid();
    this.privTurnDeferral = new Deferred();
    this.privTurnDeferral.resolve();
  }
  get requestId() {
    return this.privRequestId;
  }
  get streamId() {
    return this.privStreamId;
  }
  set streamId(value) {
    this.privStreamId = value;
  }
  get audioOutputFormat() {
    return this.privAudioOutputFormat;
  }
  set audioOutputFormat(format) {
    this.privAudioOutputFormat = format;
  }
  get turnCompletionPromise() {
    return this.privTurnDeferral.promise;
  }
  get isSynthesisEnded() {
    return this.privIsSynthesisEnded;
  }
  get isSynthesizing() {
    return this.privIsSynthesizing;
  }
  get currentTextOffset() {
    return this.privTextOffset;
  }
  get currentSentenceOffset() {
    return this.privSentenceOffset;
  }
  get bytesReceived() {
    return this.privBytesReceived;
  }
  get audioDuration() {
    return this.privAudioDuration;
  }
  getAllReceivedAudio() {
    return __awaiter$6(this, void 0, void 0, function* () {
      if (!!this.privReceivedAudio) {
        return Promise.resolve(this.privReceivedAudio);
      }
      if (!this.privIsSynthesisEnded) {
        return null;
      }
      yield this.readAllAudioFromStream();
      return Promise.resolve(this.privReceivedAudio);
    });
  }
  getAllReceivedAudioWithHeader() {
    return __awaiter$6(this, void 0, void 0, function* () {
      if (!!this.privReceivedAudioWithHeader) {
        return this.privReceivedAudioWithHeader;
      }
      if (!this.privIsSynthesisEnded) {
        return null;
      }
      if (this.audioOutputFormat.hasHeader) {
        const audio = yield this.getAllReceivedAudio();
        this.privReceivedAudioWithHeader = SynthesisAdapterBase.addHeader(audio, this.audioOutputFormat);
        return this.privReceivedAudioWithHeader;
      } else {
        return this.getAllReceivedAudio();
      }
    });
  }
  startNewSynthesis(requestId, rawText, isSSML, audioDestination) {
    this.privIsSynthesisEnded = false;
    this.privIsSynthesizing = true;
    this.privRequestId = requestId;
    this.privRawText = rawText;
    this.privIsSSML = isSSML;
    this.privAudioOutputStream = new PullAudioOutputStreamImpl();
    this.privAudioOutputStream.format = this.privAudioOutputFormat;
    this.privReceivedAudio = null;
    this.privReceivedAudioWithHeader = null;
    this.privBytesReceived = 0;
    this.privTextOffset = 0;
    this.privNextSearchTextIndex = 0;
    this.privSentenceOffset = 0;
    this.privNextSearchSentenceIndex = 0;
    this.privPartialVisemeAnimation = "";
    if (audioDestination !== void 0) {
      this.privTurnAudioDestination = audioDestination;
      this.privTurnAudioDestination.format = this.privAudioOutputFormat;
    }
    this.onEvent(new SynthesisTriggeredEvent(this.requestId, void 0, audioDestination === void 0 ? void 0 : audioDestination.id()));
  }
  onPreConnectionStart(authFetchEventId) {
    this.privAuthFetchEventId = authFetchEventId;
    this.onEvent(new ConnectingToSynthesisServiceEvent(this.privRequestId, this.privAuthFetchEventId));
  }
  onAuthCompleted(isError) {
    if (isError) {
      this.onComplete();
    }
  }
  onConnectionEstablishCompleted(statusCode) {
    if (statusCode === 200) {
      this.onEvent(new SynthesisStartedEvent(this.requestId, this.privAuthFetchEventId));
      this.privBytesReceived = 0;
      return;
    } else if (statusCode === 403) {
      this.onComplete();
    }
  }
  onServiceResponseMessage(responseJson) {
    const response = JSON.parse(responseJson);
    this.streamId = response.audio.streamId;
  }
  onServiceTurnEndResponse() {
    this.privInTurn = false;
    this.privTurnDeferral.resolve();
    this.onComplete();
  }
  onServiceTurnStartResponse() {
    if (!!this.privTurnDeferral && !!this.privInTurn) {
      this.privTurnDeferral.reject("Another turn started before current completed.");
      this.privTurnDeferral.promise.then().catch(() => {
      });
    }
    this.privInTurn = true;
    this.privTurnDeferral = new Deferred();
  }
  onAudioChunkReceived(data) {
    if (this.isSynthesizing) {
      this.privAudioOutputStream.write(data);
      this.privBytesReceived += data.byteLength;
      if (this.privTurnAudioDestination !== void 0) {
        this.privTurnAudioDestination.write(data);
      }
    }
  }
  onTextBoundaryEvent(metadata) {
    this.updateTextOffset(metadata.Data.text.Text, metadata.Type);
  }
  onVisemeMetadataReceived(metadata) {
    if (metadata.Data.AnimationChunk !== void 0) {
      this.privPartialVisemeAnimation += metadata.Data.AnimationChunk;
    }
  }
  onSessionEnd(metadata) {
    this.privAudioDuration = metadata.Data.Offset;
  }
  dispose() {
    if (!this.privIsDisposed) {
      this.privIsDisposed = true;
    }
  }
  onStopSynthesizing() {
    this.onComplete();
  }
  getAndClearVisemeAnimation() {
    const animation = this.privPartialVisemeAnimation;
    this.privPartialVisemeAnimation = "";
    return animation;
  }
  onEvent(event) {
    Events.instance.onEvent(event);
  }
  static isXmlTag(text) {
    return text.length >= 2 && text[0] === "<" && text[text.length - 1] === ">";
  }
  updateTextOffset(text, type2) {
    if (type2 === MetadataType.WordBoundary) {
      this.privTextOffset = this.privRawText.indexOf(text, this.privNextSearchTextIndex);
      if (this.privTextOffset >= 0) {
        this.privNextSearchTextIndex = this.privTextOffset + text.length;
        if (this.privIsSSML) {
          if (this.withinXmlTag(this.privTextOffset) && !SynthesisTurn.isXmlTag(text)) {
            this.updateTextOffset(text, type2);
          }
        }
      }
    } else {
      this.privSentenceOffset = this.privRawText.indexOf(text, this.privNextSearchSentenceIndex);
      if (this.privSentenceOffset >= 0) {
        this.privNextSearchSentenceIndex = this.privSentenceOffset + text.length;
        if (this.privIsSSML) {
          if (this.withinXmlTag(this.privSentenceOffset) && !SynthesisTurn.isXmlTag(text)) {
            this.updateTextOffset(text, type2);
          }
        }
      }
    }
  }
  onComplete() {
    if (this.privIsSynthesizing) {
      this.privIsSynthesizing = false;
      this.privIsSynthesisEnded = true;
      this.privAudioOutputStream.close();
      this.privInTurn = false;
      if (this.privTurnAudioDestination !== void 0) {
        this.privTurnAudioDestination.close();
        this.privTurnAudioDestination = void 0;
      }
    }
  }
  readAllAudioFromStream() {
    return __awaiter$6(this, void 0, void 0, function* () {
      if (this.privIsSynthesisEnded) {
        this.privReceivedAudio = new ArrayBuffer(this.bytesReceived);
        try {
          yield this.privAudioOutputStream.read(this.privReceivedAudio);
        } catch (e) {
          this.privReceivedAudio = new ArrayBuffer(0);
        }
      }
    });
  }
  withinXmlTag(idx) {
    return this.privRawText.indexOf("<", idx + 1) > this.privRawText.indexOf(">", idx + 1);
  }
}
class SynthesisRestAdapter {
  constructor(config) {
    let endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Endpoint, void 0);
    if (!endpoint) {
      const region = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Region, "westus");
      const hostSuffix = ConnectionFactoryBase.getHostSuffix(region);
      endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Host, `https://${region}.tts.speech${hostSuffix}`);
    }
    this.privUri = `${endpoint}/cognitiveservices/voices/list`;
    const options = RestConfigBase.requestOptions;
    options.headers[RestConfigBase.configParams.subscriptionKey] = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Key, void 0);
    this.privRestAdapter = new RestMessageAdapter(options);
  }
  getVoicesList(connectionId) {
    this.privRestAdapter.setHeaders(HeaderNames.ConnectionId, connectionId);
    return this.privRestAdapter.request(RestRequestType.Get, this.privUri);
  }
}
var SynthesisServiceType;
(function(SynthesisServiceType2) {
  SynthesisServiceType2[SynthesisServiceType2["Standard"] = 0] = "Standard";
  SynthesisServiceType2[SynthesisServiceType2["Custom"] = 1] = "Custom";
})(SynthesisServiceType || (SynthesisServiceType = {}));
class SynthesizerConfig {
  constructor(speechServiceConfig, parameters) {
    this.privSynthesisServiceType = SynthesisServiceType.Standard;
    this.privSpeechServiceConfig = speechServiceConfig ? speechServiceConfig : new SpeechServiceConfig(new Context(null));
    this.privParameters = parameters;
  }
  get parameters() {
    return this.privParameters;
  }
  get synthesisServiceType() {
    return this.privSynthesisServiceType;
  }
  set synthesisServiceType(value) {
    this.privSynthesisServiceType = value;
  }
  get SpeechServiceConfig() {
    return this.privSpeechServiceConfig;
  }
}
class SynthesisContext {
  constructor(speechSynthesizer) {
    this.privContext = {};
    this.privSpeechSynthesizer = speechSynthesizer;
  }
  setSection(sectionName, value) {
    this.privContext[sectionName] = value;
  }
  set audioOutputFormat(format) {
    this.privAudioOutputFormat = format;
  }
  toJSON() {
    const synthesisSection = this.buildSynthesisContext();
    this.setSection("synthesis", synthesisSection);
    return JSON.stringify(this.privContext);
  }
  buildSynthesisContext() {
    return {
      audio: {
        metadataOptions: {
          bookmarkEnabled: !!this.privSpeechSynthesizer.bookmarkReached,
          punctuationBoundaryEnabled: this.privSpeechSynthesizer.properties.getProperty(PropertyId.SpeechServiceResponse_RequestPunctuationBoundary, !!this.privSpeechSynthesizer.wordBoundary),
          sentenceBoundaryEnabled: this.privSpeechSynthesizer.properties.getProperty(PropertyId.SpeechServiceResponse_RequestSentenceBoundary, false),
          sessionEndEnabled: true,
          visemeEnabled: !!this.privSpeechSynthesizer.visemeReceived,
          wordBoundaryEnabled: this.privSpeechSynthesizer.properties.getProperty(PropertyId.SpeechServiceResponse_RequestWordBoundary, !!this.privSpeechSynthesizer.wordBoundary)
        },
        outputFormat: this.privAudioOutputFormat.requestAudioFormatString
      },
      language: {
        autoDetection: this.privSpeechSynthesizer.autoDetectSourceLanguage
      }
    };
  }
}
const OutputFormatPropertyName = "OutputFormat";
const CancellationErrorCodePropertyName = "CancellationErrorCode";
const ServicePropertiesPropertyName = "ServiceProperties";
const ForceDictationPropertyName = "ForceDictation";
const AutoDetectSourceLanguagesOpenRangeOptionName = "OpenRange";
var __awaiter$5 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const AudioWorkletSourceURLPropertyName = "MICROPHONE-WorkletSourceUrl";
class MicAudioSource {
  constructor(privRecorder, deviceId, audioSourceId, mediaStream) {
    this.privRecorder = privRecorder;
    this.deviceId = deviceId;
    this.privStreams = {};
    this.privOutputChunkSize = MicAudioSource.AUDIOFORMAT.avgBytesPerSec / 10;
    this.privId = audioSourceId ? audioSourceId : createNoDashGuid();
    this.privEvents = new EventSource();
    this.privMediaStream = mediaStream || null;
    this.privIsClosing = false;
  }
  get format() {
    return Promise.resolve(MicAudioSource.AUDIOFORMAT);
  }
  get blob() {
    return Promise.reject("Not implemented for Mic input");
  }
  turnOn() {
    if (this.privInitializeDeferral) {
      return this.privInitializeDeferral.promise;
    }
    this.privInitializeDeferral = new Deferred();
    try {
      this.createAudioContext();
    } catch (error) {
      if (error instanceof Error) {
        const typedError = error;
        this.privInitializeDeferral.reject(typedError.name + ": " + typedError.message);
      } else {
        this.privInitializeDeferral.reject(error);
      }
      return this.privInitializeDeferral.promise;
    }
    const nav = window.navigator;
    let getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
    if (!!nav.mediaDevices) {
      getUserMedia = (constraints, successCallback, errorCallback) => {
        nav.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
      };
    }
    if (!getUserMedia) {
      const errorMsg = "Browser does not support getUserMedia.";
      this.privInitializeDeferral.reject(errorMsg);
      this.onEvent(new AudioSourceErrorEvent(errorMsg, ""));
    } else {
      const next = () => {
        this.onEvent(new AudioSourceInitializingEvent(this.privId));
        if (this.privMediaStream && this.privMediaStream.active) {
          this.onEvent(new AudioSourceReadyEvent(this.privId));
          this.privInitializeDeferral.resolve();
        } else {
          getUserMedia({ audio: this.deviceId ? { deviceId: this.deviceId } : true, video: false }, (mediaStream) => {
            this.privMediaStream = mediaStream;
            this.onEvent(new AudioSourceReadyEvent(this.privId));
            this.privInitializeDeferral.resolve();
          }, (error) => {
            const errorMsg = `Error occurred during microphone initialization: ${error}`;
            this.privInitializeDeferral.reject(errorMsg);
            this.onEvent(new AudioSourceErrorEvent(this.privId, errorMsg));
          });
        }
      };
      if (this.privContext.state === "suspended") {
        this.privContext.resume().then(next).catch((reason) => {
          this.privInitializeDeferral.reject(`Failed to initialize audio context: ${reason}`);
        });
      } else {
        next();
      }
    }
    return this.privInitializeDeferral.promise;
  }
  id() {
    return this.privId;
  }
  attach(audioNodeId) {
    this.onEvent(new AudioStreamNodeAttachingEvent(this.privId, audioNodeId));
    return this.listen(audioNodeId).then((stream) => {
      this.onEvent(new AudioStreamNodeAttachedEvent(this.privId, audioNodeId));
      return {
        detach: () => __awaiter$5(this, void 0, void 0, function* () {
          stream.readEnded();
          delete this.privStreams[audioNodeId];
          this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
          return this.turnOff();
        }),
        id: () => audioNodeId,
        read: () => stream.read()
      };
    });
  }
  detach(audioNodeId) {
    if (audioNodeId && this.privStreams[audioNodeId]) {
      this.privStreams[audioNodeId].close();
      delete this.privStreams[audioNodeId];
      this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
    }
  }
  turnOff() {
    return __awaiter$5(this, void 0, void 0, function* () {
      for (const streamId in this.privStreams) {
        if (streamId) {
          const stream = this.privStreams[streamId];
          if (stream) {
            stream.close();
          }
        }
      }
      this.onEvent(new AudioSourceOffEvent(this.privId));
      if (this.privInitializeDeferral) {
        yield this.privInitializeDeferral;
        this.privInitializeDeferral = null;
      }
      yield this.destroyAudioContext();
      return;
    });
  }
  get events() {
    return this.privEvents;
  }
  get deviceInfo() {
    return this.getMicrophoneLabel().then((label) => ({
      bitspersample: MicAudioSource.AUDIOFORMAT.bitsPerSample,
      channelcount: MicAudioSource.AUDIOFORMAT.channels,
      connectivity: connectivity.Unknown,
      manufacturer: "Speech SDK",
      model: label,
      samplerate: MicAudioSource.AUDIOFORMAT.samplesPerSec,
      type: type.Microphones
    }));
  }
  setProperty(name, value) {
    if (name === AudioWorkletSourceURLPropertyName) {
      this.privRecorder.setWorkletUrl(value);
    } else {
      throw new Error("Property '" + name + "' is not supported on Microphone.");
    }
  }
  getMicrophoneLabel() {
    const defaultMicrophoneName = "microphone";
    if (this.privMicrophoneLabel !== void 0) {
      return Promise.resolve(this.privMicrophoneLabel);
    }
    if (this.privMediaStream === void 0 || !this.privMediaStream.active) {
      return Promise.resolve(defaultMicrophoneName);
    }
    this.privMicrophoneLabel = defaultMicrophoneName;
    const microphoneDeviceId = this.privMediaStream.getTracks()[0].getSettings().deviceId;
    if (void 0 === microphoneDeviceId) {
      return Promise.resolve(this.privMicrophoneLabel);
    }
    const deferred = new Deferred();
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      for (const device of devices) {
        if (device.deviceId === microphoneDeviceId) {
          this.privMicrophoneLabel = device.label;
          break;
        }
      }
      deferred.resolve(this.privMicrophoneLabel);
    }, () => deferred.resolve(this.privMicrophoneLabel));
    return deferred.promise;
  }
  listen(audioNodeId) {
    return __awaiter$5(this, void 0, void 0, function* () {
      yield this.turnOn();
      const stream = new ChunkedArrayBufferStream(this.privOutputChunkSize, audioNodeId);
      this.privStreams[audioNodeId] = stream;
      try {
        this.privRecorder.record(this.privContext, this.privMediaStream, stream);
      } catch (error) {
        this.onEvent(new AudioStreamNodeErrorEvent(this.privId, audioNodeId, error));
        throw error;
      }
      const result = stream;
      return result;
    });
  }
  onEvent(event) {
    this.privEvents.onEvent(event);
    Events.instance.onEvent(event);
  }
  createAudioContext() {
    if (!!this.privContext) {
      return;
    }
    this.privContext = AudioStreamFormatImpl.getAudioContext(MicAudioSource.AUDIOFORMAT.samplesPerSec);
  }
  destroyAudioContext() {
    return __awaiter$5(this, void 0, void 0, function* () {
      if (!this.privContext) {
        return;
      }
      this.privRecorder.releaseMediaResources(this.privContext);
      let hasClose = false;
      if ("close" in this.privContext) {
        hasClose = true;
      }
      if (hasClose) {
        if (!this.privIsClosing) {
          this.privIsClosing = true;
          yield this.privContext.close();
          this.privContext = null;
          this.privIsClosing = false;
        }
      } else if (null !== this.privContext && this.privContext.state === "running") {
        yield this.privContext.suspend();
      }
    });
  }
}
MicAudioSource.AUDIOFORMAT = AudioStreamFormat.getDefaultInputFormat();
var __awaiter$4 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class FileAudioSource {
  constructor(file, filename, audioSourceId) {
    this.privStreams = {};
    this.privHeaderEnd = 44;
    this.privId = audioSourceId ? audioSourceId : createNoDashGuid();
    this.privEvents = new EventSource();
    this.privSource = file;
    if (typeof window !== "undefined" && typeof Blob !== "undefined" && this.privSource instanceof Blob) {
      this.privFilename = file.name;
    } else {
      this.privFilename = filename || "unknown.wav";
    }
    this.privAudioFormatPromise = this.readHeader();
  }
  get format() {
    return this.privAudioFormatPromise;
  }
  get blob() {
    return Promise.resolve(this.privSource);
  }
  turnOn() {
    if (this.privFilename.lastIndexOf(".wav") !== this.privFilename.length - 4) {
      const errorMsg = this.privFilename + " is not supported. Only WAVE files are allowed at the moment.";
      this.onEvent(new AudioSourceErrorEvent(errorMsg, ""));
      return Promise.reject(errorMsg);
    }
    this.onEvent(new AudioSourceInitializingEvent(this.privId));
    this.onEvent(new AudioSourceReadyEvent(this.privId));
    return;
  }
  id() {
    return this.privId;
  }
  attach(audioNodeId) {
    return __awaiter$4(this, void 0, void 0, function* () {
      this.onEvent(new AudioStreamNodeAttachingEvent(this.privId, audioNodeId));
      const stream = yield this.upload(audioNodeId);
      this.onEvent(new AudioStreamNodeAttachedEvent(this.privId, audioNodeId));
      return Promise.resolve({
        detach: () => __awaiter$4(this, void 0, void 0, function* () {
          stream.readEnded();
          delete this.privStreams[audioNodeId];
          this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
          yield this.turnOff();
        }),
        id: () => audioNodeId,
        read: () => stream.read()
      });
    });
  }
  detach(audioNodeId) {
    if (audioNodeId && this.privStreams[audioNodeId]) {
      this.privStreams[audioNodeId].close();
      delete this.privStreams[audioNodeId];
      this.onEvent(new AudioStreamNodeDetachedEvent(this.privId, audioNodeId));
    }
  }
  turnOff() {
    for (const streamId in this.privStreams) {
      if (streamId) {
        const stream = this.privStreams[streamId];
        if (stream && !stream.isClosed) {
          stream.close();
        }
      }
    }
    this.onEvent(new AudioSourceOffEvent(this.privId));
    return Promise.resolve();
  }
  get events() {
    return this.privEvents;
  }
  get deviceInfo() {
    return this.privAudioFormatPromise.then((result) => Promise.resolve({
      bitspersample: result.bitsPerSample,
      channelcount: result.channels,
      connectivity: connectivity.Unknown,
      manufacturer: "Speech SDK",
      model: "File",
      samplerate: result.samplesPerSec,
      type: type.File
    }));
  }
  readHeader() {
    const maxHeaderSize = 512;
    const header = this.privSource.slice(0, maxHeaderSize);
    const headerResult = new Deferred();
    const processHeader = (header2) => {
      const view = new DataView(header2);
      const getWord = (index) => String.fromCharCode(view.getUint8(index), view.getUint8(index + 1), view.getUint8(index + 2), view.getUint8(index + 3));
      if ("RIFF" !== getWord(0)) {
        headerResult.reject("Invalid WAV header in file, RIFF was not found");
        return;
      }
      if ("WAVE" !== getWord(8) || "fmt " !== getWord(12)) {
        headerResult.reject("Invalid WAV header in file, WAVEfmt was not found");
        return;
      }
      const formatSize = view.getInt32(16, true);
      const channelCount = view.getUint16(22, true);
      const sampleRate = view.getUint32(24, true);
      const bitsPerSample = view.getUint16(34, true);
      let pos = 36 + Math.max(formatSize - 16, 0);
      for (; getWord(pos) !== "data"; pos += 2) {
        if (pos > maxHeaderSize - 8) {
          headerResult.reject("Invalid WAV header in file, data block was not found");
          return;
        }
      }
      this.privHeaderEnd = pos + 8;
      headerResult.resolve(AudioStreamFormat.getWaveFormatPCM(sampleRate, bitsPerSample, channelCount));
    };
    if (typeof window !== "undefined" && typeof Blob !== "undefined" && header instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const header2 = event.target.result;
        processHeader(header2);
      };
      reader.readAsArrayBuffer(header);
    } else {
      const h = header;
      processHeader(h.buffer.slice(h.byteOffset, h.byteOffset + h.byteLength));
    }
    return headerResult.promise;
  }
  upload(audioNodeId) {
    return __awaiter$4(this, void 0, void 0, function* () {
      const onerror = (error) => {
        const errorMsg = `Error occurred while processing '${this.privFilename}'. ${error}`;
        this.onEvent(new AudioStreamNodeErrorEvent(this.privId, audioNodeId, errorMsg));
        throw new Error(errorMsg);
      };
      try {
        yield this.turnOn();
        const format = yield this.privAudioFormatPromise;
        const stream = new ChunkedArrayBufferStream(format.avgBytesPerSec / 10, audioNodeId);
        this.privStreams[audioNodeId] = stream;
        const chunk = this.privSource.slice(this.privHeaderEnd);
        const processFile = (buff) => {
          if (stream.isClosed) {
            return;
          }
          stream.writeStreamChunk({
            buffer: buff,
            isEnd: false,
            timeReceived: Date.now()
          });
          stream.close();
        };
        if (typeof window !== "undefined" && typeof Blob !== "undefined" && chunk instanceof Blob) {
          const reader = new FileReader();
          reader.onerror = (ev) => onerror(ev.toString());
          reader.onload = (event) => {
            const fileBuffer = event.target.result;
            processFile(fileBuffer);
          };
          reader.readAsArrayBuffer(chunk);
        } else {
          const c = chunk;
          processFile(c.buffer.slice(c.byteOffset, c.byteOffset + c.byteLength));
        }
        return stream;
      } catch (e) {
        onerror(e);
      }
    });
  }
  onEvent(event) {
    this.privEvents.onEvent(event);
    Events.instance.onEvent(event);
  }
}
class PcmRecorder {
  constructor(stopInputOnRelease) {
    this.privStopInputOnRelease = stopInputOnRelease;
  }
  record(context, mediaStream, outputStream) {
    const desiredSampleRate = 16e3;
    const waveStreamEncoder = new RiffPcmEncoder(context.sampleRate, desiredSampleRate);
    const micInput = context.createMediaStreamSource(mediaStream);
    if (!this.privSpeechProcessorScript) {
      const workletScript = `class SP extends AudioWorkletProcessor {
                constructor(options) {
                  super(options);
                }
                process(inputs, outputs) {
                  const input = inputs[0];
                  const output = [];
                  for (let channel = 0; channel < input.length; channel += 1) {
                    output[channel] = input[channel];
                  }
                  this.port.postMessage(output[0]);
                  return true;
                }
              }
              registerProcessor('speech-processor', SP);`;
      const blob = new Blob([workletScript], { type: "application/javascript; charset=utf-8" });
      this.privSpeechProcessorScript = URL.createObjectURL(blob);
    }
    const attachScriptProcessor = () => {
      const scriptNode = (() => {
        let bufferSize = 0;
        try {
          return context.createScriptProcessor(bufferSize, 1, 1);
        } catch (error) {
          bufferSize = 2048;
          let audioSampleRate = context.sampleRate;
          while (bufferSize < 16384 && audioSampleRate >= 2 * desiredSampleRate) {
            bufferSize <<= 1;
            audioSampleRate >>= 1;
          }
          return context.createScriptProcessor(bufferSize, 1, 1);
        }
      })();
      scriptNode.onaudioprocess = (event) => {
        const inputFrame = event.inputBuffer.getChannelData(0);
        if (outputStream && !outputStream.isClosed) {
          const waveFrame = waveStreamEncoder.encode(inputFrame);
          if (!!waveFrame) {
            outputStream.writeStreamChunk({
              buffer: waveFrame,
              isEnd: false,
              timeReceived: Date.now()
            });
          }
        }
      };
      micInput.connect(scriptNode);
      scriptNode.connect(context.destination);
      this.privMediaResources = {
        scriptProcessorNode: scriptNode,
        source: micInput,
        stream: mediaStream
      };
    };
    if (!!this.privSpeechProcessorScript && !!context.audioWorklet) {
      context.audioWorklet.addModule(this.privSpeechProcessorScript).then(() => {
        const workletNode = new AudioWorkletNode(context, "speech-processor");
        workletNode.port.onmessage = (ev) => {
          const inputFrame = ev.data;
          if (outputStream && !outputStream.isClosed) {
            const waveFrame = waveStreamEncoder.encode(inputFrame);
            if (!!waveFrame) {
              outputStream.writeStreamChunk({
                buffer: waveFrame,
                isEnd: false,
                timeReceived: Date.now()
              });
            }
          }
        };
        micInput.connect(workletNode);
        workletNode.connect(context.destination);
        this.privMediaResources = {
          scriptProcessorNode: workletNode,
          source: micInput,
          stream: mediaStream
        };
      }).catch(() => {
        attachScriptProcessor();
      });
    } else {
      try {
        attachScriptProcessor();
      } catch (err) {
        throw new Error(`Unable to start audio worklet node for PCMRecorder: ${err}`);
      }
    }
  }
  releaseMediaResources(context) {
    if (this.privMediaResources) {
      if (this.privMediaResources.scriptProcessorNode) {
        this.privMediaResources.scriptProcessorNode.disconnect(context.destination);
        this.privMediaResources.scriptProcessorNode = null;
      }
      if (this.privMediaResources.source) {
        this.privMediaResources.source.disconnect();
        if (this.privStopInputOnRelease) {
          this.privMediaResources.stream.getTracks().forEach((track) => track.stop());
        }
        this.privMediaResources.source = null;
      }
    }
  }
  setWorkletUrl(url) {
    this.privSpeechProcessorScript = url;
  }
}
var __awaiter$3 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class CertCheckAgent {
  constructor(proxyInfo) {
    if (!!proxyInfo) {
      this.privProxyInfo = proxyInfo;
    }
    if (!CertCheckAgent.privDiskCache) {
      CertCheckAgent.privDiskCache = new ws("microsoft-cognitiveservices-speech-sdk-cache", { supportBuffer: true, location: typeof process !== "undefined" && !!{}.SPEECH_OCSP_CACHE_ROOT ? {}.SPEECH_OCSP_CACHE_ROOT : void 0 });
    }
  }
  static forceReinitDiskCache() {
    CertCheckAgent.privDiskCache = void 0;
    CertCheckAgent.privMemCache = {};
  }
  GetAgent(disableStapling) {
    const agent = new ws.Agent(this.CreateConnection);
    if (this.privProxyInfo !== void 0 && this.privProxyInfo.HostName !== void 0 && this.privProxyInfo.Port > 0) {
      const proxyName = "privProxyInfo";
      agent[proxyName] = this.privProxyInfo;
    }
    return agent;
  }
  static GetProxyAgent(proxyInfo) {
    const httpProxyOptions = {
      host: proxyInfo.HostName,
      port: proxyInfo.Port
    };
    if (!!proxyInfo.UserName) {
      httpProxyOptions.headers = {
        "Proxy-Authentication": "Basic " + new Buffer(`${proxyInfo.UserName}:${proxyInfo.Password === void 0 ? "" : proxyInfo.Password}`).toString("base64")
      };
    } else {
      httpProxyOptions.headers = {};
    }
    httpProxyOptions.headers.requestOCSP = "true";
    const httpProxyAgent = new ws(httpProxyOptions);
    return httpProxyAgent;
  }
  static OCSPCheck(socketPromise, proxyInfo) {
    return __awaiter$3(this, void 0, void 0, function* () {
      let ocspRequest;
      let stapling;
      let resolved = false;
      const socket = yield socketPromise;
      socket.cork();
      const tlsSocket = socket;
      return new Promise((resolve, reject) => {
        socket.on("OCSPResponse", (data) => {
          if (!!data) {
            this.onEvent(new OCSPStapleReceivedEvent());
            stapling = data;
          }
        });
        socket.on("error", (error) => {
          if (!resolved) {
            resolved = true;
            socket.destroy();
            reject(error);
          }
        });
        tlsSocket.on("secure", () => __awaiter$3(this, void 0, void 0, function* () {
          const peer = tlsSocket.getPeerCertificate(true);
          try {
            const issuer = yield this.GetIssuer(peer);
            ocspRequest = (void 0)(peer.raw, issuer.raw);
            const sig = ocspRequest.id.toString("hex");
            if (!stapling) {
              const cacheEntry = yield CertCheckAgent.GetResponseFromCache(sig, ocspRequest, proxyInfo);
              stapling = cacheEntry;
            }
            yield this.VerifyOCSPResponse(stapling, ocspRequest, proxyInfo);
            socket.uncork();
            resolved = true;
            resolve(socket);
          } catch (e) {
            socket.destroy();
            resolved = true;
            reject(e);
          }
        }));
      });
    });
  }
  static GetIssuer(peer) {
    if (peer.issuerCertificate) {
      return Promise.resolve(peer.issuerCertificate);
    }
    return new Promise((resolve, reject) => {
      const ocspAgent = new (void 0)({});
      ocspAgent.fetchIssuer(peer, null, (error, value) => {
        if (!!error) {
          reject(error);
          return;
        }
        resolve(value);
      });
    });
  }
  static GetResponseFromCache(signature, ocspRequest, proxyInfo) {
    return __awaiter$3(this, void 0, void 0, function* () {
      let cachedResponse = CertCheckAgent.privMemCache[signature];
      if (!!cachedResponse) {
        this.onEvent(new OCSPMemoryCacheHitEvent(signature));
      }
      if (!cachedResponse) {
        try {
          const diskCacheResponse = yield CertCheckAgent.privDiskCache.get(signature);
          if (!!diskCacheResponse.isCached) {
            CertCheckAgent.onEvent(new OCSPDiskCacheHitEvent(signature));
            CertCheckAgent.StoreMemoryCacheEntry(signature, diskCacheResponse.value);
            cachedResponse = diskCacheResponse.value;
          }
        } catch (error) {
          cachedResponse = null;
        }
      }
      if (!cachedResponse) {
        return cachedResponse;
      }
      try {
        const cachedOcspResponse = (void 0)(cachedResponse);
        const responseValue = cachedOcspResponse.value;
        const tbsData = responseValue.tbsResponseData;
        if (tbsData.responses.length < 1) {
          this.onEvent(new OCSPCacheFetchErrorEvent(signature, "Not enough data in cached response"));
          return;
        }
        const cachedStartTime = tbsData.responses[0].thisUpdate;
        const cachedNextTime = tbsData.responses[0].nextUpdate;
        if (cachedNextTime < Date.now() + this.testTimeOffset - 6e4) {
          this.onEvent(new OCSPCacheEntryExpiredEvent(signature, cachedNextTime));
          cachedResponse = null;
        } else {
          const minUpdate = Math.min(24 * 60 * 60 * 1e3, (cachedNextTime - cachedStartTime) / 2);
          if (cachedNextTime - (Date.now() + this.testTimeOffset) < minUpdate) {
            this.onEvent(new OCSPCacheEntryNeedsRefreshEvent(signature, cachedStartTime, cachedNextTime));
            this.UpdateCache(ocspRequest, proxyInfo).catch((error) => {
              this.onEvent(new OCSPCacheUpdateErrorEvent(signature, error.toString()));
            });
          } else {
            this.onEvent(new OCSPCacheHitEvent(signature, cachedStartTime, cachedNextTime));
          }
        }
      } catch (error) {
        this.onEvent(new OCSPCacheFetchErrorEvent(signature, error));
        cachedResponse = null;
      }
      if (!cachedResponse) {
        this.onEvent(new OCSPCacheMissEvent(signature));
      }
      return cachedResponse;
    });
  }
  static VerifyOCSPResponse(cacheValue, ocspRequest, proxyInfo) {
    return __awaiter$3(this, void 0, void 0, function* () {
      let ocspResponse = cacheValue;
      if (!ocspResponse) {
        ocspResponse = yield CertCheckAgent.GetOCSPResponse(ocspRequest, proxyInfo);
      }
      return new Promise((resolve, reject) => {
        (void 0)({ request: ocspRequest, response: ocspResponse }, (error) => {
          if (!!error) {
            CertCheckAgent.onEvent(new OCSPVerificationFailedEvent(ocspRequest.id.toString("hex"), error));
            if (!!cacheValue) {
              this.VerifyOCSPResponse(null, ocspRequest, proxyInfo).then(() => {
                resolve();
              }, (error2) => {
                reject(error2);
              });
            } else {
              reject(error);
            }
          } else {
            if (!cacheValue) {
              CertCheckAgent.StoreCacheEntry(ocspRequest.id.toString("hex"), ocspResponse);
            }
            resolve();
          }
        });
      });
    });
  }
  static UpdateCache(req, proxyInfo) {
    return __awaiter$3(this, void 0, void 0, function* () {
      const signature = req.id.toString("hex");
      this.onEvent(new OCSPCacheUpdateNeededEvent(signature));
      const rawResponse = yield this.GetOCSPResponse(req, proxyInfo);
      this.StoreCacheEntry(signature, rawResponse);
      this.onEvent(new OCSPCacheUpdateCompleteEvent(req.id.toString("hex")));
    });
  }
  static StoreCacheEntry(sig, rawResponse) {
    this.StoreMemoryCacheEntry(sig, rawResponse);
    this.StoreDiskCacheEntry(sig, rawResponse);
  }
  static StoreMemoryCacheEntry(sig, rawResponse) {
    this.privMemCache[sig] = rawResponse;
    this.onEvent(new OCSPMemoryCacheStoreEvent(sig));
  }
  static StoreDiskCacheEntry(sig, rawResponse) {
    this.privDiskCache.set(sig, rawResponse).then(() => {
      this.onEvent(new OCSPDiskCacheStoreEvent(sig));
    });
  }
  static GetOCSPResponse(req, proxyInfo) {
    const ocspMethod = "1.3.6.1.5.5.7.48.1";
    let options = {};
    if (!!proxyInfo) {
      const agent = CertCheckAgent.GetProxyAgent(proxyInfo);
      options.agent = agent;
    }
    return new Promise((resolve, reject) => {
      (void 0)(req.cert, ocspMethod, (error, uri) => {
        if (error) {
          reject(error);
          return;
        }
        const url = new URL(uri);
        options = Object.assign(Object.assign({}, options), { host: url.host, protocol: url.protocol, port: url.port, path: url.pathname, hostname: url.host });
        (void 0)(options, req.data, (error2, raw) => {
          if (error2) {
            reject(error2);
            return;
          }
          const certID = req.certID;
          this.onEvent(new OCSPResponseRetrievedEvent(certID.toString("hex")));
          resolve(raw);
        });
      });
    });
  }
  static onEvent(event) {
    Events.instance.onEvent(event);
  }
  CreateConnection(request, options) {
    const enableOCSP = typeof process !== "undefined" && {}.NODE_TLS_REJECT_UNAUTHORIZED !== "0" && {}.SPEECH_CONDUCT_OCSP_CHECK !== "0" && options.secureEndpoint;
    let socketPromise;
    options = Object.assign(Object.assign({}, options), {
      requestOCSP: !CertCheckAgent.forceDisableOCSPStapling,
      servername: options.host
    });
    if (!!this.privProxyInfo) {
      const httpProxyAgent = CertCheckAgent.GetProxyAgent(this.privProxyInfo);
      const baseAgent = httpProxyAgent;
      socketPromise = new Promise((resolve, reject) => {
        baseAgent.callback(request, options, (error, socket) => {
          if (!!error) {
            reject(error);
          } else {
            resolve(socket);
          }
        });
      });
    } else {
      if (!!options.secureEndpoint) {
        socketPromise = Promise.resolve((void 0)(options));
      } else {
        socketPromise = Promise.resolve((void 0)(options));
      }
    }
    if (!!enableOCSP) {
      return CertCheckAgent.OCSPCheck(socketPromise, this.privProxyInfo);
    } else {
      return socketPromise;
    }
  }
}
CertCheckAgent.testTimeOffset = 0;
CertCheckAgent.forceDisableOCSPStapling = false;
CertCheckAgent.privMemCache = {};
var __awaiter$2 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class WebsocketMessageAdapter {
  constructor(uri, connectionId, messageFormatter, proxyInfo, headers, enableCompression) {
    if (!uri) {
      throw new ArgumentNullError("uri");
    }
    if (!messageFormatter) {
      throw new ArgumentNullError("messageFormatter");
    }
    this.proxyInfo = proxyInfo;
    this.privConnectionEvents = new EventSource();
    this.privConnectionId = connectionId;
    this.privMessageFormatter = messageFormatter;
    this.privConnectionState = ConnectionState.None;
    this.privUri = uri;
    this.privHeaders = headers;
    this.privEnableCompression = enableCompression;
    this.privHeaders[HeaderNames.ConnectionId] = this.privConnectionId;
    this.privLastErrorReceived = "";
  }
  get state() {
    return this.privConnectionState;
  }
  open() {
    if (this.privConnectionState === ConnectionState.Disconnected) {
      return Promise.reject(`Cannot open a connection that is in ${this.privConnectionState} state`);
    }
    if (this.privConnectionEstablishDeferral) {
      return this.privConnectionEstablishDeferral.promise;
    }
    this.privConnectionEstablishDeferral = new Deferred();
    this.privCertificateValidatedDeferral = new Deferred();
    this.privConnectionState = ConnectionState.Connecting;
    try {
      if (typeof WebSocket !== "undefined" && !WebsocketMessageAdapter.forceNpmWebSocket) {
        this.privCertificateValidatedDeferral.resolve();
        this.privWebsocketClient = new WebSocket(this.privUri);
      } else {
        const options = { headers: this.privHeaders, perMessageDeflate: this.privEnableCompression };
        this.privCertificateValidatedDeferral.resolve();
        const checkAgent = new CertCheckAgent(this.proxyInfo);
        options.agent = checkAgent.GetAgent();
        const uri = new URL(this.privUri);
        let protocol = uri.protocol;
        if ((protocol === null || protocol === void 0 ? void 0 : protocol.toLocaleLowerCase()) === "wss:") {
          protocol = "https:";
        } else if ((protocol === null || protocol === void 0 ? void 0 : protocol.toLocaleLowerCase()) === "ws:") {
          protocol = "http:";
        }
        options.agent.protocol = protocol;
        this.privWebsocketClient = new ws(this.privUri, options);
      }
      this.privWebsocketClient.binaryType = "arraybuffer";
      this.privReceivingMessageQueue = new Queue();
      this.privDisconnectDeferral = new Deferred();
      this.privSendMessageQueue = new Queue();
      this.processSendQueue().catch((reason) => {
        Events.instance.onEvent(new BackgroundEvent(reason));
      });
    } catch (error) {
      this.privConnectionEstablishDeferral.resolve(new ConnectionOpenResponse(500, error));
      return this.privConnectionEstablishDeferral.promise;
    }
    this.onEvent(new ConnectionStartEvent(this.privConnectionId, this.privUri));
    this.privWebsocketClient.onopen = () => {
      this.privCertificateValidatedDeferral.promise.then(() => {
        this.privConnectionState = ConnectionState.Connected;
        this.onEvent(new ConnectionEstablishedEvent(this.privConnectionId));
        this.privConnectionEstablishDeferral.resolve(new ConnectionOpenResponse(200, ""));
      }, (error) => {
        this.privConnectionEstablishDeferral.reject(error);
      });
    };
    this.privWebsocketClient.onerror = (e) => {
      this.onEvent(new ConnectionErrorEvent(this.privConnectionId, e.message, e.type));
      this.privLastErrorReceived = e.message;
    };
    this.privWebsocketClient.onclose = (e) => {
      if (this.privConnectionState === ConnectionState.Connecting) {
        this.privConnectionState = ConnectionState.Disconnected;
        this.privConnectionEstablishDeferral.resolve(new ConnectionOpenResponse(e.code, e.reason + " " + this.privLastErrorReceived));
      } else {
        this.privConnectionState = ConnectionState.Disconnected;
        this.privWebsocketClient = null;
        this.onEvent(new ConnectionClosedEvent(this.privConnectionId, e.code, e.reason));
      }
      this.onClose(e.code, e.reason).catch((reason) => {
        Events.instance.onEvent(new BackgroundEvent(reason));
      });
    };
    this.privWebsocketClient.onmessage = (e) => {
      const networkReceivedTime = new Date().toISOString();
      if (this.privConnectionState === ConnectionState.Connected) {
        const deferred = new Deferred();
        this.privReceivingMessageQueue.enqueueFromPromise(deferred.promise);
        if (e.data instanceof ArrayBuffer) {
          const rawMessage = new RawWebsocketMessage(MessageType.Binary, e.data);
          this.privMessageFormatter.toConnectionMessage(rawMessage).then((connectionMessage) => {
            this.onEvent(new ConnectionMessageReceivedEvent(this.privConnectionId, networkReceivedTime, connectionMessage));
            deferred.resolve(connectionMessage);
          }, (error) => {
            deferred.reject(`Invalid binary message format. Error: ${error}`);
          });
        } else {
          const rawMessage = new RawWebsocketMessage(MessageType.Text, e.data);
          this.privMessageFormatter.toConnectionMessage(rawMessage).then((connectionMessage) => {
            this.onEvent(new ConnectionMessageReceivedEvent(this.privConnectionId, networkReceivedTime, connectionMessage));
            deferred.resolve(connectionMessage);
          }, (error) => {
            deferred.reject(`Invalid text message format. Error: ${error}`);
          });
        }
      }
    };
    return this.privConnectionEstablishDeferral.promise;
  }
  send(message) {
    if (this.privConnectionState !== ConnectionState.Connected) {
      return Promise.reject(`Cannot send on connection that is in ${ConnectionState[this.privConnectionState]} state`);
    }
    const messageSendStatusDeferral = new Deferred();
    const messageSendDeferral = new Deferred();
    this.privSendMessageQueue.enqueueFromPromise(messageSendDeferral.promise);
    this.privMessageFormatter.fromConnectionMessage(message).then((rawMessage) => {
      messageSendDeferral.resolve({
        Message: message,
        RawWebsocketMessage: rawMessage,
        sendStatusDeferral: messageSendStatusDeferral
      });
    }, (error) => {
      messageSendDeferral.reject(`Error formatting the message. ${error}`);
    });
    return messageSendStatusDeferral.promise;
  }
  read() {
    if (this.privConnectionState !== ConnectionState.Connected) {
      return Promise.reject(`Cannot read on connection that is in ${this.privConnectionState} state`);
    }
    return this.privReceivingMessageQueue.dequeue();
  }
  close(reason) {
    if (this.privWebsocketClient) {
      if (this.privConnectionState !== ConnectionState.Disconnected) {
        this.privWebsocketClient.close(1e3, reason ? reason : "Normal closure by client");
      }
    } else {
      return Promise.resolve();
    }
    return this.privDisconnectDeferral.promise;
  }
  get events() {
    return this.privConnectionEvents;
  }
  sendRawMessage(sendItem) {
    try {
      if (!sendItem) {
        return Promise.resolve();
      }
      this.onEvent(new ConnectionMessageSentEvent(this.privConnectionId, new Date().toISOString(), sendItem.Message));
      if (this.isWebsocketOpen) {
        this.privWebsocketClient.send(sendItem.RawWebsocketMessage.payload);
      } else {
        return Promise.reject("websocket send error: Websocket not ready " + this.privConnectionId + " " + sendItem.Message.id + " " + new Error().stack);
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(`websocket send error: ${e}`);
    }
  }
  onClose(code, reason) {
    return __awaiter$2(this, void 0, void 0, function* () {
      const closeReason = `Connection closed. ${code}: ${reason}`;
      this.privConnectionState = ConnectionState.Disconnected;
      this.privDisconnectDeferral.resolve();
      yield this.privReceivingMessageQueue.drainAndDispose(() => {
      }, closeReason);
      yield this.privSendMessageQueue.drainAndDispose((pendingSendItem) => {
        pendingSendItem.sendStatusDeferral.reject(closeReason);
      }, closeReason);
    });
  }
  processSendQueue() {
    return __awaiter$2(this, void 0, void 0, function* () {
      while (true) {
        const itemToSend = this.privSendMessageQueue.dequeue();
        const sendItem = yield itemToSend;
        if (!sendItem) {
          return;
        }
        try {
          yield this.sendRawMessage(sendItem);
          sendItem.sendStatusDeferral.resolve();
        } catch (sendError) {
          sendItem.sendStatusDeferral.reject(sendError);
        }
      }
    });
  }
  onEvent(event) {
    this.privConnectionEvents.onEvent(event);
    Events.instance.onEvent(event);
  }
  get isWebsocketOpen() {
    return this.privWebsocketClient && this.privWebsocketClient.readyState === this.privWebsocketClient.OPEN;
  }
}
WebsocketMessageAdapter.forceNpmWebSocket = false;
var __awaiter$1 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class WebsocketConnection {
  constructor(uri, queryParameters, headers, messageFormatter, proxyInfo, enableCompression = false, connectionId) {
    this.privIsDisposed = false;
    if (!uri) {
      throw new ArgumentNullError("uri");
    }
    if (!messageFormatter) {
      throw new ArgumentNullError("messageFormatter");
    }
    this.privMessageFormatter = messageFormatter;
    let queryParams = "";
    let i = 0;
    if (queryParameters) {
      for (const paramName in queryParameters) {
        if (paramName) {
          queryParams += i === 0 && uri.indexOf("?") === -1 ? "?" : "&";
          const val = encodeURIComponent(queryParameters[paramName]);
          queryParams += `${paramName}=${val}`;
          i++;
        }
      }
    }
    if (headers) {
      for (const headerName in headers) {
        if (headerName) {
          queryParams += i === 0 && uri.indexOf("?") === -1 ? "?" : "&";
          const val = encodeURIComponent(headers[headerName]);
          queryParams += `${headerName}=${val}`;
          i++;
        }
      }
    }
    this.privUri = uri + queryParams;
    this.privId = connectionId ? connectionId : createNoDashGuid();
    this.privConnectionMessageAdapter = new WebsocketMessageAdapter(this.privUri, this.id, this.privMessageFormatter, proxyInfo, headers, enableCompression);
  }
  dispose() {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.privIsDisposed = true;
      if (this.privConnectionMessageAdapter) {
        yield this.privConnectionMessageAdapter.close();
      }
    });
  }
  isDisposed() {
    return this.privIsDisposed;
  }
  get id() {
    return this.privId;
  }
  state() {
    return this.privConnectionMessageAdapter.state;
  }
  open() {
    return this.privConnectionMessageAdapter.open();
  }
  send(message) {
    return this.privConnectionMessageAdapter.send(message);
  }
  read() {
    return this.privConnectionMessageAdapter.read();
  }
  get events() {
    return this.privConnectionMessageAdapter.events;
  }
}
class ProxyInfo {
  constructor(proxyHostName, proxyPort, proxyUserName, proxyPassword) {
    this.privProxyHostName = proxyHostName;
    this.privProxyPort = proxyPort;
    this.privProxyUserName = proxyUserName;
    this.privProxyPassword = proxyPassword;
  }
  static fromParameters(parameters) {
    return new ProxyInfo(parameters.getProperty(PropertyId.SpeechServiceConnection_ProxyHostName), parseInt(parameters.getProperty(PropertyId.SpeechServiceConnection_ProxyPort), 10), parameters.getProperty(PropertyId.SpeechServiceConnection_ProxyUserName), parameters.getProperty(PropertyId.SpeechServiceConnection_ProxyPassword));
  }
  static fromRecognizerConfig(config) {
    return this.fromParameters(config.parameters);
  }
  get HostName() {
    return this.privProxyHostName;
  }
  get Port() {
    return this.privProxyPort;
  }
  get UserName() {
    return this.privProxyUserName;
  }
  get Password() {
    return this.privProxyPassword;
  }
}
const encodings = /* @__PURE__ */ new Set(["json", "buffer", "string"]);
var core$1 = (mkrequest2) => (...args) => {
  const statusCodes = /* @__PURE__ */ new Set();
  let method;
  let encoding;
  let headers;
  let baseurl = "";
  args.forEach((arg) => {
    if (typeof arg === "string") {
      if (arg.toUpperCase() === arg) {
        if (method) {
          const msg = `Can't set method to ${arg}, already set to ${method}.`;
          throw new Error(msg);
        } else {
          method = arg;
        }
      } else if (arg.startsWith("http:") || arg.startsWith("https:")) {
        baseurl = arg;
      } else {
        if (encodings.has(arg)) {
          encoding = arg;
        } else {
          throw new Error(`Unknown encoding, ${arg}`);
        }
      }
    } else if (typeof arg === "number") {
      statusCodes.add(arg);
    } else if (typeof arg === "object") {
      if (Array.isArray(arg) || arg instanceof Set) {
        arg.forEach((code) => statusCodes.add(code));
      } else {
        if (headers) {
          throw new Error("Cannot set headers twice.");
        }
        headers = arg;
      }
    } else {
      throw new Error(`Unknown type: ${typeof arg}`);
    }
  });
  if (!method)
    method = "GET";
  if (statusCodes.size === 0) {
    statusCodes.add(200);
  }
  return mkrequest2(statusCodes, method, encoding, headers, baseurl);
};
const core = core$1;
class StatusError extends Error {
  constructor(res, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusError);
    }
    this.name = "StatusError";
    this.message = res.statusMessage;
    this.statusCode = res.status;
    this.res = res;
    this.json = res.json.bind(res);
    this.text = res.text.bind(res);
    this.arrayBuffer = res.arrayBuffer.bind(res);
    let buffer;
    const get = () => {
      if (!buffer)
        buffer = this.arrayBuffer();
      return buffer;
    };
    Object.defineProperty(this, "responseBody", { get });
    this.headers = {};
    for (const [key, value] of res.headers.entries()) {
      this.headers[key.toLowerCase()] = value;
    }
  }
}
const mkrequest = (statusCodes, method, encoding, headers, baseurl) => async (_url, body, _headers = {}) => {
  _url = baseurl + (_url || "");
  let parsed = new URL(_url);
  if (!headers)
    headers = {};
  if (parsed.username) {
    headers.Authorization = "Basic " + btoa(parsed.username + ":" + parsed.password);
    parsed = new URL(parsed.protocol + "//" + parsed.host + parsed.pathname + parsed.search);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Unknown protocol, ${parsed.protocol}`);
  }
  if (body) {
    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body) || typeof body === "string")
      ;
    else if (typeof body === "object") {
      body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    } else {
      throw new Error("Unknown body type.");
    }
  }
  _headers = new Headers({ ...headers || {}, ..._headers });
  const resp = await fetch(parsed, { method, headers: _headers, body });
  resp.statusCode = resp.status;
  if (!statusCodes.has(resp.status)) {
    throw new StatusError(resp);
  }
  if (encoding === "json")
    return resp.json();
  else if (encoding === "buffer")
    return resp.arrayBuffer();
  else if (encoding === "string")
    return resp.text();
  else
    return resp;
};
var browser = core(mkrequest);
var __awaiter = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var RestRequestType;
(function(RestRequestType2) {
  RestRequestType2["Get"] = "GET";
  RestRequestType2["Post"] = "POST";
  RestRequestType2["Delete"] = "DELETE";
  RestRequestType2["File"] = "file";
})(RestRequestType || (RestRequestType = {}));
class RestMessageAdapter {
  constructor(configParams) {
    if (!configParams) {
      throw new ArgumentNullError("configParams");
    }
    this.privHeaders = configParams.headers;
    this.privIgnoreCache = configParams.ignoreCache;
  }
  static extractHeaderValue(headerKey, headers) {
    let headerValue = "";
    try {
      const arr = headers.trim().split(/[\r\n]+/);
      const headerMap = {};
      arr.forEach((line) => {
        const parts = line.split(": ");
        const header = parts.shift().toLowerCase();
        const value = parts.join(": ");
        headerMap[header] = value;
      });
      headerValue = headerMap[headerKey.toLowerCase()];
    } catch (e) {
    }
    return headerValue;
  }
  set options(configParams) {
    this.privHeaders = configParams.headers;
    this.privIgnoreCache = configParams.ignoreCache;
  }
  setHeaders(key, value) {
    this.privHeaders[key] = value;
  }
  request(method, uri, queryParams = {}, body = null, binaryBody = null) {
    const responseReceivedDeferral = new Deferred();
    const requestCommand = method === RestRequestType.File ? "POST" : method;
    const handleRestResponse = (data, j = {}) => {
      const d = data;
      return {
        data: JSON.stringify(j),
        headers: JSON.stringify(data.headers),
        json: j,
        ok: data.statusCode >= 200 && data.statusCode < 300,
        status: data.statusCode,
        statusText: j.error ? j.error.message : d.statusText ? d.statusText : d.statusMessage
      };
    };
    const blobToArrayBuffer = (blob) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    const send = (postData) => {
      const sendRequest = browser(uri, requestCommand, this.privHeaders, 200, 201, 202, 204, 400, 401, 402, 403, 404);
      const params = this.queryParams(queryParams) === "" ? "" : `?${this.queryParams(queryParams)}`;
      sendRequest(params, postData).then((data) => __awaiter(this, void 0, void 0, function* () {
        if (method === RestRequestType.Delete || data.statusCode === 204) {
          responseReceivedDeferral.resolve(handleRestResponse(data));
        } else {
          try {
            const j = yield data.json();
            responseReceivedDeferral.resolve(handleRestResponse(data, j));
          } catch (_a) {
            responseReceivedDeferral.resolve(handleRestResponse(data));
          }
        }
      })).catch((error) => {
        responseReceivedDeferral.reject(error);
      });
    };
    if (this.privIgnoreCache) {
      this.privHeaders["Cache-Control"] = "no-cache";
    }
    if (method === RestRequestType.File && binaryBody) {
      const contentType = "multipart/form-data";
      this.privHeaders["content-type"] = contentType;
      this.privHeaders["Content-Type"] = contentType;
      if (typeof Blob !== "undefined" && binaryBody instanceof Blob) {
        blobToArrayBuffer(binaryBody).then((res) => {
          send(res);
        }).catch((error) => {
          responseReceivedDeferral.reject(error);
        });
      } else {
        send(binaryBody);
      }
    } else {
      if (method === RestRequestType.Post && body) {
        this.privHeaders["content-type"] = "application/json";
        this.privHeaders["Content-Type"] = "application/json";
      }
      send(body);
    }
    return responseReceivedDeferral.promise;
  }
  withQuery(url, params = {}) {
    const queryString = this.queryParams(params);
    return queryString ? url + (url.indexOf("?") === -1 ? "?" : "&") + queryString : url;
  }
  queryParams(params = {}) {
    return Object.keys(params).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
  }
}
class TextToSpeech {
  constructor(key, region, voice = "male") {
    __publicField(this, "key");
    __publicField(this, "region");
    __publicField(this, "voice");
    __publicField(this, "textToRead", "");
    __publicField(this, "wordBoundryList", []);
    __publicField(this, "clickedNode");
    __publicField(this, "highlightDiv");
    __publicField(this, "speechConfig");
    __publicField(this, "audioConfig");
    __publicField(this, "player");
    __publicField(this, "synthesizer");
    __publicField(this, "previousWordBoundary");
    this.key = key;
    this.region = region;
    this.voice = voice;
  }
  async start() {
    setInterval(() => {
      var _a;
      if (this.player !== void 0 && this.highlightDiv) {
        const currentTime = this.player.currentTime;
        let wordBoundary;
        for (const e of this.wordBoundryList) {
          if (currentTime * 1e3 > e.audioOffset / 1e4) {
            wordBoundary = e;
          } else {
            break;
          }
        }
        if (~[".", ",", "!", "?"].indexOf(wordBoundary.text)) {
          wordBoundary = (_a = this.previousWordBoundary) != null ? _a : void 0;
        }
        if (wordBoundary !== void 0) {
          this.previousWordBoundary = wordBoundary;
          this.highlightDiv.innerHTML = this.textToRead.substr(0, wordBoundary.textOffset) + "<span class='co-tts-highlight'>" + wordBoundary.text + "</span>" + this.textToRead.substr(wordBoundary.textOffset + wordBoundary.wordLength);
        } else {
          this.highlightDiv.innerHTML = this.textToRead;
        }
      }
    }, 50);
    await this.registerBindings(document);
  }
  async synthesis() {
  }
  async registerBindings(node) {
    let nodes = node.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i]) {
        continue;
      }
      let currentNode = nodes[i];
      if (currentNode.attributes) {
        if (currentNode.attributes.getNamedItem("co-tts.id")) {
          await this.handleIdModifier(currentNode, currentNode.attributes.getNamedItem("co-tts.id"));
        } else if (currentNode.attributes.getNamedItem("co-tts.ajax")) {
          await this.handleAjaxModifier(currentNode, currentNode.attributes.getNamedItem("co-tts.ajax"));
        } else if (currentNode.attributes.getNamedItem("co-tts")) {
          await this.handleDefault(currentNode, currentNode.attributes.getNamedItem("co-tts"));
        } else if (currentNode.attributes.getNamedItem("co-tts.stop")) {
          await this.handleStopModifier(currentNode, currentNode.attributes.getNamedItem("co-tts.stop"));
        } else if (currentNode.attributes.getNamedItem("co-tts.resume")) {
          await this.handleResumeModifier(currentNode, currentNode.attributes.getNamedItem("co-tts.resume"));
        } else if (currentNode.attributes.getNamedItem("co-tts.pause")) {
          await this.handlePauseModifier(currentNode, currentNode.attributes.getNamedItem("co-tts.pause"));
        }
      }
      if (currentNode.childNodes.length > 0) {
        await this.registerBindings(currentNode);
      }
    }
  }
  async handleIdModifier(node, attr) {
    node.addEventListener("click", async (_) => {
      var _a;
      this.stopPlayer();
      this.clickedNode = node;
      let referenceDiv = document.getElementById(attr.value);
      if (!referenceDiv) {
        return;
      }
      if (referenceDiv.hasAttribute("co-tts.text") && referenceDiv.getAttribute("co-tts.text") !== "") {
        this.textToRead = (_a = referenceDiv.getAttribute("co-tts.text")) != null ? _a : "";
      } else {
        this.textToRead = referenceDiv.innerText;
      }
      if (referenceDiv.hasAttribute("co-tts.highlight")) {
        this.highlightDiv = referenceDiv;
      }
      this.startSynthesizer(node, attr);
    });
  }
  async handleAjaxModifier(node, attr) {
    node.addEventListener("click", async (_) => {
      this.stopPlayer();
      this.clickedNode = node;
      let response = await fetch(attr.value, {
        method: `GET`
      });
      this.textToRead = await response.text();
      this.startSynthesizer(node, attr);
    });
  }
  async handleDefault(node, attr) {
    node.addEventListener("click", async (_) => {
      this.stopPlayer();
      this.clickedNode = node;
      if (node.hasAttribute("co-tts.highlight")) {
        this.highlightDiv = node;
      }
      if (attr.value === "") {
        this.textToRead = node.innerText;
      } else {
        this.textToRead = attr.value;
      }
      this.startSynthesizer(node, attr);
    });
  }
  async handleStopModifier(node, attr) {
    node.addEventListener("click", async (_) => {
      await this.stopPlayer();
    });
  }
  async handlePauseModifier(node, attr) {
    node.addEventListener("click", async (_) => {
      await this.player.pause();
    });
  }
  async handleResumeModifier(node, attr) {
    node.addEventListener("click", async (_) => {
      await this.player.resume();
    });
  }
  async stopPlayer() {
    if (this.highlightDiv !== void 0) {
      this.highlightDiv.innerHTML = this.textToRead;
    }
    this.textToRead = "";
    this.wordBoundryList = [];
    if (this.player !== void 0) {
      this.player.pause();
    }
    this.player = void 0;
    this.highlightDiv = void 0;
  }
  async startSynthesizer(node, attr) {
    this.speechConfig = SpeechConfig.fromSubscription(this.key, this.region);
    if (this.voice === "female") {
      this.speechConfig.speechSynthesisVoiceName = "Microsoft Server Speech Text to Speech Voice (nl-NL, ColetteNeural)";
    } else {
      this.speechConfig.speechSynthesisVoiceName = "Microsoft Server Speech Text to Speech Voice (nl-NL, MaartenNeural)";
    }
    this.speechConfig.speechSynthesisOutputFormat = 8;
    this.player = new SpeakerAudioDestination();
    this.audioConfig = AudioConfig.fromSpeakerOutput(this.player);
    this.synthesizer = new SpeechSynthesizer(this.speechConfig, this.audioConfig);
    this.synthesizer.wordBoundary = (s, e) => {
      this.wordBoundryList.push(e);
    };
    this.player.onAudioEnd = () => {
      this.stopPlayer();
      if (this.clickedNode.hasAttribute("co-tts.next")) {
        let nextNode = document.getElementById(this.clickedNode.getAttribute("co-tts.next"));
        if (nextNode) {
          nextNode.dispatchEvent(new Event("click"));
        }
      }
    };
    this.synthesizer.speakTextAsync(
      this.textToRead,
      () => {
        this.synthesizer.close();
        this.synthesizer = void 0;
      },
      () => {
        this.synthesizer.close();
        this.synthesizer = void 0;
      }
    );
  }
}
export { TextToSpeech as default };
