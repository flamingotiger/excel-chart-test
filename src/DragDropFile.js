import React from 'react';

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
export default class DragDropFile extends React.Component {
	constructor(props) {
		super(props);
		this.onDrop = this.onDrop.bind(this);
	};
	suppress(e) {
    e.stopPropagation(); e.preventDefault();
  };
	onDrop(e) {
    e.stopPropagation(); e.preventDefault();
		const files = e.dataTransfer.files;
		if(files && files[0]) this.props.handleFile(files[0]);
	};
	render() {
    return (
      <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
      	{this.props.children}
      </div>
  	);
  };
};
