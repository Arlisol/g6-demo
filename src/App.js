import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Select } from 'antd';
import './App.css';
import DrawGraph from './DrawGraph';

const { Option } = Select;

const Root = styled.div`
  width: 100%;
  height: 100%;
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
  }
`;

const App = (props) => {
  const { className, style } = props;

  const [showMountNode, setShowMountNode] = useState(false);
  const [showMountNode3, setShowMountNode3] = useState(false);
  const [data1, setData1] = useState(null);
  const [config1, setConfig1] = useState(null);
  const [data2, setData2] = useState(null);
  const [config2, setConfig2] = useState(null);
  const [data3, setData3] = useState(null);
  const [config3, setConfig3] = useState(null);

  async function getGraphData1() {
    const response = await fetch('http://rap2api.taobao.org/app/mock/237556/getGraphData1');
    const graphData1 = await response.json();
    return graphData1;
  }

  async function getGraphData2() {
    const response = await fetch('http://rap2api.taobao.org/app/mock/237556/getGraphData2');
    const graphData2 = await response.json();
    return graphData2;
  }

  async function getGraphData3() {
    const response = await fetch('http://rap2api.taobao.org/app/mock/237556/getGraphData3');
    const graphData3 = await response.json();
    return graphData3;
  }

  async function getGraphDepartmentData1() {
    const response = await fetch('http://rap2api.taobao.org/app/mock/237556/getGraphDepartmentData1');
    const graphDepartmentData1 = await response.json();
    return graphDepartmentData1;
  }

  async function getGraphDepartmentData2() {
    const response = await fetch('http://rap2api.taobao.org/app/mock/237556/getGraphDepartmentData2');
    const graphDepartmentData2 = await response.json();
    return graphDepartmentData2;
  }

  function setSize(data) {
    return {
      nodes : data.nodes.map(item => {
        const size = 30;
        if(item.hasChildren) {
          return {...item,size};
        }
        return item;
      }), 
      edges:data.edges,
    }
  }

  function graphClickEvent(e) {
    if(e.item._cfg.model.hasChildren) {
      if(e.item._cfg.model.hasChildren) {
        //将graph1隐藏
        createGraph3();
      }
    }
  }

  function closeClickEvent() {
    init();
  }

  async function handleChange(value) {
    let data1 = {};
    let data2 = {};
    if(value !== 'all') {
      data1 = await getGraphDepartmentData1();
      data2 = await getGraphDepartmentData2();
    } else {
      data1 = await getGraphData1();
      data2 = await getGraphData2();
    }
    setData1(data1);
    setData2(data2);
  }

  async function init(){
    const data1 = await getGraphData1();
    const data2 = await getGraphData2();
    const width = document.getElementById('contain').clientWidth - 24*2;
    const config1 = {
      width,          // Number，必须，图的宽度
      height: 200,              // Number，必须，图的高度
    }
    const config2 = {
      width,          // Number，必须，图的宽度
      height: 500,              // Number，必须，图的高度
      fitView: true,
    }
    setData1(data1);
    setConfig1(config1);
    setData2(data2);
    setConfig2(config2);
    setShowMountNode(true);
    setShowMountNode3(false);
  }

  async function createGraph3() {
    const data3 = await getGraphData3();
    const width = document.getElementById('contain').clientWidth - 24*2;
    const config3 = {
      width,          // Number，必须，图的宽度
      height: 500,              // Number，必须，图的高度
    }
    setData3(data3);
    setConfig3(config3);
    setShowMountNode(false);
    setShowMountNode3(true);
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Root className={className} style={style}>
      <Card id="contain">
        {showMountNode && 
          (<div>
            <span>选择特定部门：</span>
            <Select defaultValue="all" style={{ width: 120 }} onChange={handleChange}>
              <Option value="all">全部</Option>
              <Option value="department1">部门1</Option>
              <Option value="department2">部门2</Option>
              <Option value="department3">部门3</Option>
            </Select>
          </div>)
        }
        {showMountNode && <DrawGraph data={setSize(data1)} config={config1} nodeClickEvent={graphClickEvent} />}
        {showMountNode && <DrawGraph data={setSize(data2)} config={config2} nodeClickEvent={graphClickEvent} />}
        {showMountNode3 && <DrawGraph data={setSize(data3)} config={config3}>
          <button onClick={closeClickEvent} className="close">关闭</button>
        </DrawGraph>}
      </Card>
    </Root>
  );
}

export default App;