
import { GraphData, NodeStatus, NodeType, UserProfile, RadarDataPoint, GrowthDataPoint } from './types';

export const THEME_COLORS: Record<string, string> = {
  core: '#ffffff',
  safety: '#ef4444', // red-500
  battery: '#10b981', // emerald-500
  motor: '#eab308', // yellow-500
  drive: '#eab308', 
  chassis: '#3b82f6', // blue-500
  electronic: '#8b5cf6', // violet-500
  standard: '#06b6d4', // cyan-500
  default: '#64748b', // slate-500
};

export const USER_PROFILE: UserProfile = {
  name: "余新倩",
  id: "2024085201",
  major: "新能源汽车技术",
  class: "新能源2402班",
  avatarUrl: "/avatar1.png", // 默认预留文件名
  masteredCount: 39,
  totalCount: 60
};

export const RADAR_DATA: RadarDataPoint[] = [
  { subject: '高压安全', A: 90, fullMark: 100 },
  { subject: '电池诊断', A: 75, fullMark: 100 },
  { subject: '底盘机械', A: 85, fullMark: 100 },
  { subject: '电子电控', A: 60, fullMark: 100 },
  { subject: '法规标准', A: 95, fullMark: 100 },
];

export const GROWTH_DATA: GrowthDataPoint[] = [
  { month: '23.09', stage: '入学初评', score: 45 },
  { month: '23.12', stage: '理论考核', score: 62 },
  { month: '24.03', stage: '实训I期', score: 74 },
  { month: '24.06', stage: '年中总结', score: 78 },
  { month: '24.09', stage: '当前水平', score: 85 },
];

export const LEARNING_RESOURCES = [
  { type: 'pdf', title: 'GB 38900-2020 标准全文.pdf', size: '2.4 MB', tag: '国标' },
  { type: 'video', title: '高压互锁(HVIL)原理与故障排查', duration: '15:20', tag: '实操' },
  { type: 'doc', title: '新能源年审实操工单模板_V3.docx', size: '150 KB', tag: '工具' }
];

export const FUTURE_GOALS = [
    { title: '新能源高级技师考评', status: 'pending', desc: '需重点突破电池包精细化拆解技能' },
    { title: '车间班组长竞聘', status: 'locked', desc: '需积累至少500小时实车检测经验' }
];

// Raw Data from Reference
const rawNodes = [
    { id: 'root', name: '新能源汽车年审员', group: 'core', val: 35, status: 'mastered', progress: 78, desc: '具备新能源汽车安全技术检验的核心能力，熟悉GB 38900-2020标准。' },
    { id: 'safety', name: '高压安全检测', group: 'safety', val: 20, status: 'mastered', progress: 85, desc: '掌握高压系统安全操作规范、漏电监测及应急处理。' },
    { id: 'battery', name: '动力电池检测', group: 'battery', val: 20, status: 'mastered', progress: 60, desc: '动力电池SOH、一致性、外观及气密性检测。' },
    { id: 'drive', name: '驱动系统检测', group: 'drive', val: 18, status: 'mastered', progress: 45, desc: '电机运行状态、控制器逻辑及传动系统检查。' },
    { id: 'chassis', name: '底盘与制动', group: 'chassis', val: 18, status: 'mastered', progress: 90, desc: '底盘部件、再生制动性能及轮胎悬架检测。' },
    { id: 'obd', name: '电子电控(OBD)', group: 'electronic', val: 18, status: 'mastered', progress: 30, desc: 'OBD通讯协议、故障码分析及数据流解读。' },
    { id: 'regulations', name: '法规与标准', group: 'standard', val: 15, status: 'mastered', progress: 100, desc: 'GB 38900-2020 检验流程与判定标准。' },

    { id: 's1', name: '绝缘电阻检测', group: 'safety', val: 8, status: 'mastered' },
    { id: 's2', name: '漏电保护测试', group: 'safety', val: 8, status: 'mastered' },
    { id: 's3', name: '高压互锁(HVIL)', group: 'safety', val: 8, status: 'pending' }, 
    { id: 's4', name: '防护装备(PPE)', group: 'safety', val: 6, status: 'mastered' },
    { id: 's5', name: '电位均衡测试', group: 'safety', val: 6, status: 'pending' },
    { id: 's6', name: '消防应急处理', group: 'safety', val: 6, status: 'mastered' },
    { id: 's7', name: '放电操作规范', group: 'safety', val: 6, status: 'mastered' },
    { id: 's8', name: '绝缘监测验证', group: 'safety', val: 5, status: 'pending' }, 
    { id: 's9', name: '维修开关(MSD)', group: 'safety', val: 5, status: 'mastered' }, 
    { id: 's10', name: '高压警示标识', group: 'safety', val: 4, status: 'mastered' }, 

    { id: 'b1', name: '电池外观查验', group: 'battery', val: 8, status: 'mastered' },
    { id: 'b2', name: 'SOH健康度评估', group: 'battery', val: 9, status: 'pending' },
    { id: 'b3', name: '压差一致性', group: 'battery', val: 8, status: 'mastered' },
    { id: 'b4', name: '热管理系统', group: 'battery', val: 6, status: 'pending' },
    { id: 'b5', name: '充电接口检测', group: 'battery', val: 8, status: 'mastered' },
    { id: 'b6', name: '电池包气密性', group: 'battery', val: 7, status: 'pending' },
    { id: 'b7', name: '防爆阀检查', group: 'battery', val: 6, status: 'mastered' },
    { id: 'b8', name: '极柱氧化检测', group: 'battery', val: 6, status: 'mastered' },
    { id: 'b9', name: '冷却液位检查', group: 'battery', val: 5, status: 'pending' }, 
    { id: 'b10', name: '单体电压极差', group: 'battery', val: 7, status: 'pending' }, 
    { id: 'b11', name: 'SOC校准状态', group: 'battery', val: 5, status: 'pending' }, 
    { id: 'b12', name: '底部球击痕迹', group: 'battery', val: 5, status: 'mastered' }, 

    { id: 'd1', name: '驱动电机异响', group: 'drive', val: 7, status: 'mastered' },
    { id: 'd2', name: '电机控制器(MCU)', group: 'drive', val: 7, status: 'pending' },
    { id: 'd3', name: '能量回收测试', group: 'drive', val: 8, status: 'mastered' },
    { id: 'd4', name: '减速器油液', group: 'drive', val: 6, status: 'pending' },
    { id: 'd5', name: '旋变传感器', group: 'drive', val: 6, status: 'pending' },
    { id: 'd6', name: '冷却水路检查', group: 'drive', val: 6, status: 'mastered' },
    { id: 'd7', name: '零位偏移校准', group: 'drive', val: 5, status: 'pending' }, 
    { id: 'd8', name: '直流母线波纹', group: 'drive', val: 5, status: 'pending' }, 

    { id: 'c1', name: '高压线束走向', group: 'chassis', val: 7, status: 'mastered' },
    { id: 'c2', name: '电池包护板', group: 'chassis', val: 6, status: 'mastered' },
    { id: 'c3', name: '轮胎磨损', group: 'chassis', val: 6, status: 'mastered' },
    { id: 'c4', name: '电子驻车(EPB)', group: 'chassis', val: 6, status: 'mastered' },
    { id: 'c5', name: '空气悬架检测', group: 'chassis', val: 6, status: 'pending' },
    { id: 'c6', name: '四轮定位数据', group: 'chassis', val: 6, status: 'pending' },
    { id: 'c7', name: '线束波纹管', group: 'chassis', val: 5, status: 'mastered' }, 
    { id: 'c8', name: '橙色线缆老化', group: 'chassis', val: 5, status: 'mastered' }, 
    { id: 'c9', name: '再生制动踏板', group: 'chassis', val: 5, status: 'mastered' }, 

    { id: 'e1', name: 'BMS数据流', group: 'electronic', val: 8, status: 'pending' },
    { id: 'e2', name: '故障码(DTC)', group: 'electronic', val: 9, status: 'mastered' },
    { id: 'e3', name: '仪表指示灯', group: 'electronic', val: 6, status: 'mastered' },
    { id: 'e4', name: 'VCU通讯状态', group: 'electronic', val: 7, status: 'mastered' },
    { id: 'e5', name: 'CAN总线电压', group: 'electronic', val: 7, status: 'pending' },
    { id: 'e6', name: '软件版本校验', group: 'electronic', val: 6, status: 'pending' },
    { id: 'e7', name: '绝缘故障历史', group: 'electronic', val: 5, status: 'mastered' }, 
    { id: 'e8', name: '插座温度数据', group: 'electronic', val: 5, status: 'pending' }, 

    { id: 'r1', name: '唯一性检查(VIN)', group: 'standard', val: 7, status: 'mastered' },
    { id: 'r2', name: '外廓尺寸测量', group: 'standard', val: 6, status: 'mastered' },
    { id: 'r3', name: '整备质量核查', group: 'standard', val: 6, status: 'pending' },
    { id: 'r4', name: '反光标识查验', group: 'standard', val: 6, status: 'mastered' },
    { id: 'r5', name: '仪表盘报警信号', group: 'standard', val: 5, status: 'mastered' }, 
    { id: 'r6', name: '充电状态指示灯', group: 'standard', val: 5, status: 'mastered' }, 
];

const rawLinks = [
    { source: 'root', target: 'safety' }, { source: 'root', target: 'battery' }, { source: 'root', target: 'drive' },
    { source: 'root', target: 'chassis' }, { source: 'root', target: 'obd' }, { source: 'root', target: 'regulations' },
    
    { source: 'safety', target: 's1' }, { source: 'safety', target: 's2' }, { source: 'safety', target: 's3' },
    { source: 'safety', target: 's4' }, { source: 'safety', target: 's5' }, { source: 'safety', target: 's6' }, 
    { source: 'safety', target: 's7' }, { source: 'safety', target: 's8' }, { source: 'safety', target: 's9' }, { source: 'safety', target: 's10' },
    
    { source: 'battery', target: 'b1' }, { source: 'battery', target: 'b2' }, { source: 'battery', target: 'b3' },
    { source: 'battery', target: 'b4' }, { source: 'battery', target: 'b5' }, { source: 'battery', target: 'b6' },
    { source: 'battery', target: 'b7' }, { source: 'battery', target: 'b8' }, { source: 'battery', target: 'b9' }, 
    { source: 'battery', target: 'b10' }, { source: 'battery', target: 'b11' }, { source: 'battery', target: 'b12' },
    
    { source: 'drive', target: 'd1' }, { source: 'drive', target: 'd2' }, { source: 'drive', target: 'd3' },
    { source: 'drive', target: 'd4' }, { source: 'drive', target: 'd5' }, { source: 'drive', target: 'd6' },
    { source: 'drive', target: 'd7' }, { source: 'drive', target: 'd8' },
    
    { source: 'chassis', target: 'c1' }, { source: 'chassis', target: 'c2' }, { source: 'chassis', target: 'c3' },
    { source: 'chassis', target: 'c4' }, { source: 'chassis', target: 'c5' }, { source: 'chassis', target: 'c6' },
    { source: 'chassis', target: 'c7' }, { source: 'chassis', target: 'c8' }, { source: 'chassis', target: 'c9' },
    
    { source: 'obd', target: 'e1' }, { source: 'obd', target: 'e2' }, { source: 'obd', target: 'e3' },
    { source: 'obd', target: 'e4' }, { source: 'obd', target: 'e5' }, { source: 'obd', target: 'e6' },
    { source: 'obd', target: 'e7' }, { source: 'obd', target: 'e8' },
    
    { source: 'regulations', target: 'r1' }, { source: 'regulations', target: 'r2' }, { source: 'regulations', target: 'r3' }, 
    { source: 'regulations', target: 'r4' }, { source: 'regulations', target: 'r5' }, { source: 'regulations', target: 'r6' },
    
    // Cross links
    { source: 'b2', target: 'e1' }, { source: 'd3', target: 'c3' }, { source: 'b4', target: 'd6' }, 
    { source: 's1', target: 'e5' }, { source: 'b10', target: 'e1' }, { source: 's3', target: 's9' }, { source: 'c8', target: 's1' },
];

export const INITIAL_GRAPH_DATA: GraphData = {
  nodes: rawNodes.map(n => ({
      ...n,
      type: n.group === 'core' ? NodeType.CORE : (['safety','battery','drive','chassis','electronic','standard'].includes(n.group) && n.val > 10 ? NodeType.CORE : NodeType.LEAF),
      category: n.group,
      // Ensure numeric progress for Core nodes, default 0 for others if missing
      progress: n.progress ?? (n.status === 'mastered' ? 100 : 0)
  })),
  links: rawLinks.map(l => ({
      ...l,
      value: 1
  })) as any
};
