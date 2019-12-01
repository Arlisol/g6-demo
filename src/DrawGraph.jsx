import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import G6 from '@antv/g6';
import Minimap from '@antv/g6/build/minimap';
import commonConfig from './commonConfig';


const DrawGraph = props => { 
  const graph = useRef(null);
  const { data, config, useMinimap, nodeClickEvent, children } = props;
  const isFirst = useRef(false);
  const ref = useRef(null);

  //自定义节点
  G6.registerNode("multipleLabelsNode", {
    // 绘制节点
    draw: function draw(cfg, group) {
      var shape = this.drawShape(cfg, group);
      if (cfg.label && cfg.label.length) {
        this.drawLabel(cfg, group);
      }
      return shape;
    },

    // 绘制label
    drawLabel: function drawLabel(cfg, group) {
      const { label, value, hasChildren } = cfg;

      // 绘制label
      group.addShape("text", {
        attrs: {
          text: label,
          x: 0,
          y: hasChildren ? 25 : 20,
          fill: "#000",
          textAlign: "center",
          textBaseline: "middle",
        }
      });

      // 绘制value
      group.addShape("text", {
        attrs: {
          text: value,
          x: 0,
          y: hasChildren ? -25 : -20,
          fill: "#999999",
          textAlign: "center",
          textBaseline: "middle"
        }
      });
    }
  }, "circle");

  useEffect(() => {
    if (!graph.current) {
      config.container = ReactDOM.findDOMNode(ref.current);
      if(useMinimap) {
        const minimap = new Minimap({
          size: [ config.width / 4, config.height / 4],
          type: 'keyShape',
        });
        config.plugins = [minimap];
      }
      graph.current = new G6.Graph({ ...commonConfig, ...config })
    }
    graph.current.data(data);
    graph.current.render();
     // 鼠标进入节点
     graph.current.on('node:mouseenter', e => {
      if(e.item._cfg.model.hasChildren) {
        const nodeItem = e.item;  // 获取鼠标进入的节点元素对象
        graph.current.setItemState(nodeItem, 'hover', true);  // 设置当前节点的 hover 状态为 true
      }
    });
    // 鼠标离开节点
    graph.current.on('node:mouseleave', e => {
      if(e.item._cfg.model.hasChildren) {
        const nodeItem = e.item;  // 获取鼠标离开的节点元素对象
        graph.current.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
      }
    });
    if(nodeClickEvent) {
      graph.current.on('node:click', nodeClickEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if(!isFirst.current) {
      isFirst.current = true;
      return;
    }
    graph.current.read(data);
  },[data])

  return (<div ref={ref}>
    {children}
  </div>);
}

export default DrawGraph;