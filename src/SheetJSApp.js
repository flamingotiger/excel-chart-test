import React from 'react';
import XLSX from 'xlsx';
import { Line, Bar } from 'react-chartjs-2';
import DragDropFile from './DragDropFile';
import DataInput from './DataInput';
import OutTable from './OutTable';

class SheetJSApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
			cols: [],  /* Array of column objects e.g. { name: "C", K: 2 } */
      upload:false,
      type:1,
		};
		this.handleFile = this.handleFile.bind(this);
		this.exportFile = this.exportFile.bind(this);
	};
	handleFile(file/*:File*/) {
		/* Boilerplate to set up FileReader */
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, {header:1});
			/* Update state */
			this.setState({
         data: data,
         cols: make_cols(ws['!ref']),
         upload:true,
       });
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
	};
	exportFile() {
		/* convert state to workbook */
		const ws = XLSX.utils.aoa_to_sheet(this.state.data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, "sheetjs.xlsx")
	};
	render() {
    const {data} = this.state
    console.log(data);
    const styles = {
      chart:{
        display:"block",
        width: "740px",
        height: "370px"
      }
    }
    if(data.length > 17){
      var chartData1 = {
        label:`${data[18].slice(1)}`,
        data:data[19].slice(1),
        backgroundColor: `${data[20].slice(1)}`,
        borderColor: `${data[21].slice(1)}`,
        fill:data[22].slice(1),
        borderWidth:data[23].slice(1)*1,
        //lineTension:data[20].slice(1)*1//곡선없애기
      }
    }
    //업로드
    if(this.state.upload){
	    var chartData = {
					labels:data[0].slice(1),
	        datasets:[
	          {
	            label:`${data[9].slice(1)}`,
	            data:data[10].slice(1),
	            backgroundColor: `${data[11].slice(1)}`,
						  borderColor: `${data[12].slice(1)}`,
	            fill:data[13].slice(1),
	            borderWidth:data[14].slice(1)*1,
	            //lineTension:data[9].slice(1)*1,//곡선없애기
	          },
	          chartData1
	        ]
	    };
			var options={
        legend:{
          display:true,
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `${data[2].slice(1)}`,
              },
            }
          ],
          yAxes: [{
							ticks: {
												min: data[4].slice(1)*1,
												max: data[5].slice(1)*1,
												stepSize: data[6].slice(1)*1
											},
              scaleLabel: {
                display: true,
                labelString: `${data[3].slice(1)}`,
              },
            }],
        }
      }
  	}
    return (
      <div>
      <DragDropFile handleFile={this.handleFile}>
      	<div className="row"><div className="col-xs-12">
      		<DataInput handleFile={this.handleFile} />
      	</div></div>
      	<div className="row"><div className="col-xs-12">
      		<button disabled={!this.state.data.length} className="btn btn-success" onClick={this.exportFile}>Export</button>
      	</div></div>
      	<div className="row"><div className="col-xs-12">
      		<OutTable data={this.state.data} cols={this.state.cols} />
      	</div></div>
      </DragDropFile>
      <div className="chart" style={styles.chart}>
      {this.state.upload ?
          <Line
            data={chartData}
            options={options}
          /> :
          null
          }
      </div>
    </div>
    );
  };
};
export default SheetJSApp;

/* generate an array of column objects */
const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};
