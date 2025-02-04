export const ContainerState = {
  Starting: 'STARTING',
  Stopping: 'STOPPING',
  Running: 'RUNNING',
  Error: 'ERROR',
  Exited: 'EXITED',
  Deleting: 'DELETING',
  Created: 'CREATED',
  Paused: 'PAUSED',
  Stopped: 'STOPPED',
  Unknown: 'UNKNOWN',
} as const;

export const PodState = {
  Created: 'CREATED',
  Running: 'RUNNING',
  Stopped: 'STOPPED',
  Exited: 'EXITED',
  Dead: 'DEAD',
  Starting: 'STARTING',
  Stopping: 'STOPPING',
  Deleting: 'DELETING',
  Restarting: 'RESTARTING',
  Degraded: 'DEGRADED',
  Paused: 'PAUSED',
  Unknown: 'UNKNOWN',
} as const;

export const VolumeState = {
  Used: 'USED',
  Unused: 'UNUSED',
} as const;

export const ResourceElementState = {
  Running: 'RUNNING',
  Off: 'OFF',
  Starting: 'STARTING',
} as const;

export const KubernetesResourceState = {
  Starting: 'STARTING',
  Running: 'RUNNING',
  Stopped: 'STOPPED',
  Unknown: 'UNKNOWN',
} as const;

export const ResourceElementActions = {
  Start: 'Start',
  Restart: 'Restart',
  Stop: 'Stop',
  Delete: 'Delete',
} as const;

export const PlayYamlRuntime = {
  Kubernetes: 'Kubernetes',
  Podman: 'Podman',
} as const;

export type ContainerStateType = typeof ContainerState[keyof typeof ContainerState];
export type PodStateType = typeof PodState[keyof typeof PodState];
export type VolumeStateType = typeof VolumeState[keyof typeof VolumeState];
export type ResourceElementStateType = typeof ResourceElementState[keyof typeof ResourceElementState];
export type KubernetesResourceStateType = typeof KubernetesResourceState[keyof typeof KubernetesResourceState];
export type ResourceElementActionsType = typeof ResourceElementActions[keyof typeof ResourceElementActions];
export type PlayYamlRuntimeType = typeof PlayYamlRuntime[keyof typeof PlayYamlRuntime]; 