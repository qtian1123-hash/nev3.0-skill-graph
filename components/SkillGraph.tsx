'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphData, SkillNode, SkillLink, NodeType } from '../types';
import { THEME_COLORS } from '../constants';

interface SkillGraphProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeClick: (node: SkillNode) => void;
}

const SkillGraph: React.FC<SkillGraphProps> = ({ data, selectedNodeId, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SkillNode, SkillLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  const getColor = (category: string) => {
    return (THEME_COLORS as any)[category] || THEME_COLORS.default;
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

    // Use a ResizeObserver to handle dynamic resizing of the container
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries.length) return;
      
      const { width, height } = entries[0].contentRect;
      
      const svg = d3.select(svgRef.current);
      svg.attr("width", width).attr("height", height);

      // Update simulation center
      if (simulationRef.current) {
        simulationRef.current.force("center", d3.forceCenter(width / 2, height / 2));
        simulationRef.current.alpha(0.3).restart();
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 
    
    // Set initial size
    svg.attr("width", width).attr("height", height);

    // 1. Zoom Behavior
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        transformRef.current = event.transform;
      });
    
    svg.call(zoom).on("dblclick.zoom", null);
    zoomRef.current = zoom;

    // 2. Definitions (Glows, Filters)
    const defs = svg.append("defs");

    // Outer Glow Filter
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Clip Paths for Circles
    data.nodes.forEach(d => {
       const r = d.val * 2.5; 
       defs.append("clipPath")
           .attr("id", `clip-${d.id}`)
           .append("circle")
           .attr("r", r);
    });

    // 3. Force Simulation
    const simulation = d3.forceSimulation<SkillNode>(data.nodes)
      .force("link", d3.forceLink<SkillNode, SkillLink>(data.links)
          .id(d => d.id)
          .distance(d => ((d.target as SkillNode).type === NodeType.CORE ? 120 : 60)))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide<SkillNode>().radius(d => d.val * 3.5).iterations(2));

    simulationRef.current = simulation;

    // 4. Draw Links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", d => {
        // Pending links are darker
        const source = d.source as SkillNode;
        const target = d.target as SkillNode;
        return (source.status === 'pending' || target.status === 'pending') ? '#1e293b' : '#334155';
      })
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", d => {
        const source = d.source as SkillNode;
        const target = d.target as SkillNode;
        return (source.status === 'pending' || target.status === 'pending') ? "4 4" : "none";
      });

    // 5. Draw Nodes Group
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .call(d3.drag<SVGGElement, SkillNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d);
      });

    // --- NODE RENDERING ---
    
    // Core Nodes
    const coreGroup = node.filter(d => d.type === NodeType.CORE || d.val > 10);
    const leafGroup = node.filter(d => d.type !== NodeType.CORE && d.val <= 10);

    // Leaf Nodes (Simple Circles)
    leafGroup.append("circle")
      .attr("r", d => d.val * 2)
      .attr("fill", d => d.status === 'pending' ? '#334155' : getColor(d.category))
      .attr("stroke", d => d.status === 'pending' ? '#475569' : '#fff')
      .attr("stroke-width", d => d.status === 'pending' ? 1 : 1.5)
      .attr("stroke-dasharray", d => d.status === 'pending' ? "3 3" : "none")
      .attr("fill-opacity", d => d.status === 'pending' ? 0.4 : 1);
    
    leafGroup.append("text")
      .text(d => d.name)
      .attr("x", d => d.val * 2 + 6)
      .attr("y", 4)
      .attr("font-size", "10px")
      .attr("fill", d => d.status === 'pending' ? '#64748b' : '#cbd5e1')
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)");

    // Core Nodes (Wave Effect)
    coreGroup.append("circle")
        .attr("r", d => d.val * 2.5)
        .attr("fill", "#0f172a") // slate-900 background
        .attr("stroke", d => getColor(d.category))
        .attr("stroke-width", 2)
        .style("filter", "url(#glow)");

    // Clip Group for Wave
    const waveGroup = coreGroup.append("g")
        .attr("clip-path", d => `url(#clip-${d.id})`);
    
    // Wave Paths (we will animate 'd' attribute)
    const wavePath = waveGroup.append("path")
        .attr("class", "wave-path")
        .attr("fill", d => getColor(d.category))
        .attr("fill-opacity", 0.6);

    // Percentage Label
    coreGroup.append("text")
        .text(d => `${Math.round(d.progress)}%`)
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", d => Math.max(12, d.val))
        .attr("font-weight", "bold")
        .style("pointer-events", "none")
        .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)");

    // Label Name (Below)
    coreGroup.append("text")
        .text(d => d.name)
        .attr("dy", d => d.val * 2.5 + 16)
        .attr("text-anchor", "middle")
        .attr("fill", "#e2e8f0")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .style("pointer-events", "none")
        .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)");

    // Selection Ring
    node.append("circle")
      .attr("class", "selection-ring")
      .attr("r", d => (d.val * (d.type === NodeType.CORE || d.val > 10 ? 2.5 : 2)) + 6)
      .attr("fill", "none")
      .attr("stroke", "#fbbf24") // Amber for selection
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0)
      .style("filter", "url(#glow)");

    // 6. Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as SkillNode).x!)
        .attr("y1", d => (d.source as SkillNode).y!)
        .attr("x2", d => (d.target as SkillNode).x!)
        .attr("y2", d => (d.target as SkillNode).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
      
      // Update selection status visually
      node.select(".selection-ring")
        .attr("stroke-opacity", d => d.id === selectedNodeId ? 1 : 0);
    });

    // 7. Wave Animation Loop
    let time = 0;
    const animateWave = () => {
      time += 0.04;
      wavePath.attr("d", d => {
        const r = d.val * 2.5;
        const p = d.progress / 100;
        const level = r - (2 * r * p); // Water level from top
        
        // Dynamic Wave Parameters
        const amp = 4;
        const freq = 0.05;
        const phase = time + (d.index || 0);

        let path = `M ${-r},${r} L ${r},${r} L ${r},${level}`;
        for (let x = r; x >= -r; x -= 2) {
            const y = level + amp * Math.sin(x * freq + phase);
            path += ` L ${x},${y}`;
        }
        path += ` Z`;
        return path;
      });
      requestAnimationFrame(animateWave);
    };
    
    const animationId = requestAnimationFrame(animateWave);

    // Interactions
    function dragstarted(event: any, d: SkillNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: SkillNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: SkillNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      resizeObserver.disconnect();
      simulation.stop();
      cancelAnimationFrame(animationId);
    };
  }, [data]);

  // Handle Selection / FlyTo
  useEffect(() => {
    if (selectedNodeId && svgRef.current && containerRef.current && zoomRef.current) {
        const node = data.nodes.find(n => n.id === selectedNodeId);
        if (node && node.x !== undefined && node.y !== undefined) {
             const svg = d3.select(svgRef.current);
             const width = containerRef.current.clientWidth;
             const height = containerRef.current.clientHeight;
             
             svg.transition().duration(1000).call(
                zoomRef.current.transform, 
                d3.zoomIdentity.translate(width / 2, height / 2).scale(1.3).translate(-node.x, -node.y)
             );
        }
    }
  }, [selectedNodeId, data.nodes]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#020617] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
        }}
      ></div>
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)] opacity-80"></div>
      
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"></svg>
      
      {/* Floating Legend */}
      <div className="absolute bottom-6 left-6 pointer-events-none z-20">
         <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-bold">图例</div>
            <div className="space-y-2">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div><span className="text-xs text-slate-300">高压安全</span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span className="text-xs text-slate-300">动力电池</span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div><span className="text-xs text-slate-300">驱动系统</span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div><span className="text-xs text-slate-300">底盘检测</span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border border-dashed border-slate-500 bg-slate-800"></div><span className="text-xs text-slate-500">待学习</span></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SkillGraph;