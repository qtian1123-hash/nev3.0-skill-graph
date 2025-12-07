
export interface SimulationNodeDatum {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SimulationLinkDatum<NodeDatum extends SimulationNodeDatum> {
  source: NodeDatum | string | number;
  target: NodeDatum | string | number;
  index?: number;
}

export enum NodeType {
  CORE = 'CORE',
  SUB = 'SUB',
  LEAF = 'LEAF'
}

export enum NodeStatus {
  LOCKED = 'LOCKED',
  PENDING = 'PENDING',
  MASTERED = 'MASTERED'
}

export interface SkillNode extends SimulationNodeDatum {
  id: string;
  name: string;
  type: NodeType;
  status: string; // 'mastered' | 'pending' | 'locked'
  progress: number; // 0 to 100
  category: string; // e.g., 'safety', 'battery', 'motor'
  group: string; // core, safety, battery, etc.
  val: number; // For radius size
  desc?: string; // Description
}

export interface SkillLink extends SimulationLinkDatum<SkillNode> {
  source: string | SkillNode;
  target: string | SkillNode;
  value: number;
}

export interface GraphData {
  nodes: SkillNode[];
  links: SkillLink[];
}

export interface UserProfile {
  name: string;
  id: string;
  major: string;
  class: string;
  avatarUrl: string;
  masteredCount: number;
  totalCount: number;
}

export interface RadarDataPoint {
  subject: string;
  A: number; // Student
  fullMark: number;
}

export interface GrowthDataPoint {
  month: string;
  stage: string;
  score: number;
}
