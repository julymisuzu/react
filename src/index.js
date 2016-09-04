import React from 'react';
import ReactDOM from 'react-dom';
import {CommentList} from './commentList';
import {CommentForm} from './commentForm';
import $ from 'jquery';

class CommentBox extends React.Component {
	//In ES6 structure we use the constructor to generate new state variables
	constructor(props) {
		super(props);
		this.state = {data: [], url: this.props.url};
  }

  //Get the results from comments.json
	loadCommentsFromServer() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data})
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}

	handleCommentSubmit(comment) {
		var comments = this.state.data;

		// Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

		// console.log("1");
		// console.log(this.state.data);
		// console.log("2");
		// console.log(comment);


    // NOTE: In a real implementation, we would likely rely on a database or
    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    // treat Date.now() as unique-enough for our purposes.
    // var newComment = {
    //   id: Date.now(),
    //   author: comment.author,
    //   text: comment.text
    // };
    // comments.push(newComment);
    // console.log(JSON.stringify(comments));


		$.ajax({
			url: this.state.url,
			dataType: 'json',
			cache: false,
			type: 'post',
			data: JSON.stringify(newComments),
      params: JSON.stringify(newComments),
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				this.setState({data: newComments});
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}

	//This is loaded everytime the server starts
	componentDidMount() {
		this.loadCommentsFromServer();
		//Since we are using an ES6 structure, we need to use bind(this) to send
		//the props to the right environment
		// setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval);
    // console.dir(">",jsonfile.readFileSync('comments.json' ));

    // jsonfile.writeFile('comments.json', {name: 'JP'}, function (err) {
    //   console.error(err);
    // });

// fs.writeFile('comments.json', 'Hello World!').then(function() {
//   return fs.readdir('foo');
// });
	}

	render() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)} />
			</div>
		);
	}
}

ReactDOM.render (
	<CommentBox url="comments.json" pollInterval={2000} />,
	document.getElementById('content')
);