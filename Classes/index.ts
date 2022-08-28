
import { BaseResult, CustomClassMap } from '$types/lib';
import { ActorGuid } from './ActorGuid';
import { DebugObject } from './DebugObject';
import { FAthenaPawnReplayData } from './FAthenaPawnReplayData';
import { FDateTime } from './FDateTime';
import { FGameplayTag } from './FGameplayTag';
import { FGameplayTagContainer } from './FGameplayTagContainer';
import { FName } from './FName';
import { FortItemEntryStateValue } from './FortItemEntryStateValue';
import { FRepMovement } from './FRepMovement';
import { ItemDefinition } from './ItemDefinition';
import { NetworkGUID } from './NetworkGUID';
import { PlaylistInfo } from './PlaylistInfo';
import { Vector2 } from './Vector2';

const Classes: CustomClassMap<BaseResult> = {
  ActorGuid,
  DebugObject,
  FAthenaPawnReplayData,
  FDateTime,
  FGameplayTag,
  FGameplayTagContainer,
  FName,
  FortItemEntryStateValue,
  ItemDefinition,
  NetworkGUID,
  FRepMovement,
  PlaylistInfo,
  Vector2,
};

export default Classes;
