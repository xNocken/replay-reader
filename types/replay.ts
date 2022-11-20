import { NetworkGUID } from '../Classes/NetworkGUID';
import { Actor, ExternalData } from './lib';

export interface NetGuidMap {
  [key: number]: NetworkGUID,
}

export interface Packet {
  size: number,
  state: number,
  timeSeconds: number,
  streamingFix?: number,
}

export interface StringToNumber {
  [key: string]: number,
}

export interface NumberToString {
  [key: number]: string,
}

export interface StringToString {
  [key: string]: string,
}

export interface ActorMap {
  [key: number]: Actor,
}

export interface ExternalDataMap {
  [key: number]: ExternalData,
}
