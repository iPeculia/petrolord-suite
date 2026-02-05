import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const WellLogDisplay = ({ 
    well, 
    curves, 
    scale, 
    width, 
    height, 
    shift, 
    ghostData, 
    ghostSettings,
    tops,
    layers,
    onMouseDown,
    activeTool,
    isFlattened
}) => {
    const svgRef = useRef(null);
    const headerHeight = 80;
    const depthAxisWidth = 40;

    useEffect(() => {
        if (!svgRef.current || !well) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // --- Main Group with Header Offset ---
        // Flattening shift is applied to the content group to move it up/down relative to viewport
        const contentG = svg.append("g").attr("transform", `translate(0, ${headerHeight + shift})`);
        
        // --- 1. Draw Depth Axis / Grid ---
        if (layers.grid.visible) {
            // Depth axis ticks should correspond to the data's depth, not screen pixels
            // We generate ticks based on the scale domain
            const [minDepth, maxDepth] = scale.domain();
            const tickValues = d3.ticks(minDepth, maxDepth, height / 50); // approx 50px per tick

            // Grid lines
            contentG.selectAll(".grid-line")
                .data(tickValues)
                .enter()
                .append("line")
                .attr("class", "grid-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => scale(d))
                .attr("y2", d => scale(d))
                .attr("stroke", "#334155")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", layers.grid.opacity);

            // Depth Labels (only if grid is visible)
            contentG.selectAll(".depth-label")
                .data(tickValues)
                .enter()
                .append("text")
                .attr("class", "depth-label")
                .attr("x", depthAxisWidth - 5)
                .attr("y", d => scale(d) + 4)
                .attr("text-anchor", "end")
                .attr("fill", "#94a3b8")
                .attr("font-size", "10px")
                .text(d => Math.round(d));
        }

        // --- 2. Draw Curves ---
        const validCurves = curves.filter(c => well.log_data && well.log_data[c.name]);
        // Divide remaining width among active curves
        const availableWidth = width - depthAxisWidth;
        const trackWidth = validCurves.length > 0 ? availableWidth / validCurves.length : availableWidth;

        if (layers.logs.visible) {
            validCurves.forEach((curveInfo, i) => {
                const xBase = depthAxisWidth + i * trackWidth;
                const curveG = contentG.append("g")
                    .attr("transform", `translate(${xBase}, 0)`);

                // Draw Track Background/Border
                curveG.append("rect")
                    .attr("x", 0)
                    .attr("y", scale.range()[0])
                    .attr("width", trackWidth)
                    .attr("height", scale.range()[1] - scale.range()[0])
                    .attr("fill", "none")
                    .attr("stroke", "#334155")
                    .attr("stroke-dasharray", "2,2")
                    .attr("stroke-opacity", 0.3);

                const logData = well.log_data[curveInfo.name];
                if (!logData || logData.length === 0) return;

                // Determine X Scale for Curve
                // If min/max provided in curveInfo, use those, else auto-scale
                const [dataMin, dataMax] = d3.extent(logData, d => d.value);
                const xScale = d3.scaleLinear()
                    .domain([curveInfo.min ?? dataMin, curveInfo.max ?? dataMax])
                    .range([0, trackWidth]);

                // Area Fill (Left or Right based on curve type, e.g. GR fills left usually, but here optional)
                // Simple line plot for now
                const line = d3.line()
                    .x(d => xScale(d.value))
                    .y(d => scale(d.depth))
                    .defined(d => d.value != null);

                curveG.append("path")
                    .datum(logData)
                    .attr("fill", "none")
                    .attr("stroke", curveInfo.color || "cyan")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-opacity", layers.logs.opacity)
                    .attr("d", line);

                // --- Draw Ghost Curve (if applicable) ---
                if (layers.ghosts.visible && ghostData && ghostSettings && ghostSettings.targetWellId === well.id) {
                    const ghostLog = ghostData[curveInfo.name];
                    // Ghost data is already shifted in depth by calculation if we use the utility correctly, 
                    // OR we apply a transform here. The utility `calculateGhostCurve` applies depth shift.
                    // So `d.depth` in ghostLog already includes the manual ghost shift.
                    
                    if (ghostLog && ghostLog.length > 0) {
                        // We need to use the SAME scale as the target well to match visuals
                        const ghostLine = d3.line()
                            .x(d => xScale(d.value)) // Assuming similar value range for correlation
                            .y(d => scale(d.depth))
                            .defined(d => d.value != null);

                        curveG.append("path")
                            .datum(ghostLog)
                            .attr("fill", "none")
                            .attr("stroke", "#ec4899") // Pink for ghost
                            .attr("stroke-width", 1.5)
                            .attr("stroke-dasharray", "4,3")
                            .attr("stroke-opacity", 0.7)
                            .attr("d", ghostLine);
                    }
                }
            });
        }

        // --- 3. Draw Tops ---
        if (layers.tops.visible && tops) {
            const topsG = contentG.append("g").attr("transform", `translate(${depthAxisWidth}, 0)`);
            
            tops.forEach(top => {
                const y = scale(top.md);
                // Clip tops outside range if needed, but SVG handles overflow usually
                topsG.append("line")
                    .attr("x1", 0)
                    .attr("x2", availableWidth)
                    .attr("y1", y)
                    .attr("y2", y)
                    .attr("stroke", top.color || "yellow")
                    .attr("stroke-width", 2);
                
                topsG.append("text")
                    .attr("x", 5)
                    .attr("y", y - 3)
                    .attr("fill", top.color || "yellow")
                    .attr("font-size", "10px")
                    .attr("font-weight", "bold")
                    .text(top.name);
            });
        }

        // --- 4. Header Overlays (Curve Names) ---
        // This is static at the top (doesn't scroll/shift with logs)
        const headerG = svg.append("g");
        
        // Well Name Background
        headerG.append("rect")
            .attr("width", width)
            .attr("height", headerHeight)
            .attr("fill", "#1e293b")
            .attr("stroke", "#475569");
            
        headerG.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#f8fafc")
            .attr("font-weight", "bold")
            .attr("font-size", "12px")
            .text(well.name);
            
        headerG.append("text")
            .attr("x", width / 2)
            .attr("y", 35)
            .attr("text-anchor", "middle")
            .attr("fill", "#94a3b8")
            .attr("font-size", "10px")
            .text(`KB: ${well.meta?.kb || 0}m`);

        // Curve Headers
        if (layers.logs.visible && validCurves.length > 0) {
            validCurves.forEach((curveInfo, i) => {
                const xCenter = depthAxisWidth + i * trackWidth + trackWidth/2;
                headerG.append("text")
                    .attr("x", xCenter)
                    .attr("y", 60)
                    .attr("text-anchor", "middle")
                    .attr("fill", curveInfo.color || "cyan")
                    .attr("font-size", "10px")
                    .attr("font-weight", "bold")
                    .text(curveInfo.name);
                
                // Value Range Text
                // const [min, max] = d3.extent(well.log_data[curveInfo.name], d=>d.value);
                // headerG.append("text").attr("x", xCenter - trackWidth/2 + 2).attr("y", 75).text(Math.round(min)).attr("fill", "gray").attr("font-size", "8px");
                // headerG.append("text").attr("x", xCenter + trackWidth/2 - 2).attr("y", 75).text(Math.round(max)).attr("fill", "gray").attr("font-size", "8px").attr("text-anchor", "end");
            });
        }

    }, [well, curves, scale, width, height, shift, ghostData, ghostSettings, tops, layers]);

    return (
        <div 
            className="h-full border-r border-slate-700 bg-slate-950 relative select-none overflow-hidden"
            style={{ width }}
            onMouseDown={(e) => onMouseDown && onMouseDown(e, well.id)}
        >
            <svg ref={svgRef} width={width} height={height} className="block cursor-crosshair" />
            
            {/* Interactive Hit Area for Tools */}
            <div 
                className={`absolute top-[80px] left-0 w-full h-full z-20 ${activeTool === 'correlate' ? 'cursor-crosshair' : activeTool === 'pan' ? 'cursor-grab' : 'cursor-default'}`}
                onMouseDown={(e) => onMouseDown && onMouseDown(e, well.id)}
            ></div>
        </div>
    );
};

export default React.memo(WellLogDisplay);