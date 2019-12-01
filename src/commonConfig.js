const commonConfig = {
  layout: {                // Object，可选，布局的方法及其配置项，默认为 random 布局。
    type: 'dagre',
    rankdir: 'LR',
    nodesep: 25,
    ranksep: 25
  },
  defaultNode: {
    shape: 'multipleLabelsNode',
    size: 20,
    labelCfg: {
      style: {
        fontSize: 14,
      }
    }
  },
  defaultEdge: {
    style: {
      lineWidth: 1,
      stroke: '#C2C8D5'
    }
  },
  nodeStateStyles: {
    // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
    hover: {
      cursor: 'pointer',
    },
  },
  modes: {
    default: ['zoom-canvas', 'drag-canvas',{
      type: 'tooltip', // 提示框
      formatText(model) {
        // 提示框文本内容
        const keys = Object.keys(model.tooltip);
        // 临时放在这里
        const keyValue = {
          earlyWarningType: '预警类型',
          timeOutNodeNumber: '超时节点',
          timeOutRate: '超时率',
          description: '描述',
        }
        let text = '';
        keys.forEach(item => {
          text += keyValue[item] + '：' + model.tooltip[item] + '<br />';
        })
        return text;
      }
    }]
  }
}

export default commonConfig;