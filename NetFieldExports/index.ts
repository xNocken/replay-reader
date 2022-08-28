import { NetFieldExportGroupConfig } from "$types/lib";

import ActiveGameplayModifier from './cache/ActiveGameplayModifier';
import BroadcastRemoteClientInfo_ClientRemotePlayerHitMarkers from './cache/BroadcastRemoteClientInfo_ClientRemotePlayerHitMarkers';
import BroadcastRemoteClientInfo_MapMarker from './cache/BroadcastRemoteClientInfo_MapMarker';
import BroadcastRemoteClientInfoCache from './cache/BroadcastRemoteClientInfoCache';
import InventoryCache from './cache/InventoryCache';
import GameplayCues from './cache/GameplayCues';
import GameStateCache from './cache/GameStateCache';
import DamageCues from './cache/DamageCues';
import PlayerPawnCache from './cache/PlayerPawnCache';

import Containers from './properties/Containers';
import BroadcastRemoteClientInfo from './properties/BroadcastRemoteClientInfo';
import BroadcastSpectatorInfo from './properties/BroadcastSpectatorInfo';
import Inventory from './properties/Inventory';
import Pickup from './properties/Pickup';
import PlayerState from './properties/PlayerState';
import GameState from './properties/GameState';
import LabradorLlama from './properties/LabradorLlama';
import PlayerBuilds from './properties/PlayerBuilds';
import PlayerPawn from './properties/PlayerPawn';
import SafeZoneIndicator from './properties/SafeZoneIndicator';
import SoccerGame from './properties/SoccerGame';
import SpeedSign from './properties/SpeedSign';
import SupplyDrop from './properties/SupplyDrop';
import Llama from './properties/Llama';
import Vehicles from './properties/Vehicles';

import HealthSet from './properties/components/HealthSet';
import VehicleSeat from './properties/components/VehicleSeat';

const NetFieldExportsConfigs: NetFieldExportGroupConfig[] = [
  ActiveGameplayModifier,
  BroadcastRemoteClientInfo_ClientRemotePlayerHitMarkers,
  BroadcastRemoteClientInfo_MapMarker,
  BroadcastRemoteClientInfoCache,
  InventoryCache,
  GameplayCues,
  GameStateCache,
  DamageCues,
  PlayerPawnCache,

  Containers,
  BroadcastRemoteClientInfo,
  BroadcastSpectatorInfo,
  Inventory,
  Pickup,
  PlayerState,
  GameState,
  LabradorLlama,
  PlayerBuilds,
  PlayerPawn,
  SafeZoneIndicator,
  SoccerGame,
  SpeedSign,
  SupplyDrop,
  Llama,
  Vehicles,

  HealthSet,
  VehicleSeat,
];

export default NetFieldExportsConfigs;
