import React from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import BaseAPI from '../../lib/ui_api';

const TEST_SOURCES = [
  {
    id: "testsrc1080p25",
    description: "1080p25/AVC (tc,pts)"
  }, {
    id: "testsrc720p25",
    description: "720p25/AVC (tc,pts)"
  }
];

export default class Stream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.api = new BaseAPI();

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const id = this.props.streamId;
    if (id) {
      this.api.getStreamById(id).then(stream => {
        this.setState({ stream: stream });
      })
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let newStream = this.state.stream;
    newStream[name] = value;
    this.setState({ stream: newStream });
  }

  async handleStart() {
    const newStream = await this.api.startStream(this.state.stream);
    this.setState({ stream: newStream });
  }

  async handleStop() {
    const newStream = await this.api.stopStream(this.state.stream);
    this.setState({ stream: newStream });    
  }

  render() {
    const stream = this.state.stream;
    return (
      <Form>
        {stream ?
          <div>
            <Form.Row>
              <Form.Group as={Col} sm={2} controlId={"streamId" + stream.id}>
                <Form.Label>ID</Form.Label>
                <Form.Control readOnly value={stream.id} />
              </Form.Group>
              <Form.Group as={Col} sm={4} controlId={"streamDestAddress" + stream.id}>
                <Form.Label>Destination Address</Form.Label>
                <Form.Control value={stream.destAddress} onChange={this.handleChange} name="destAddress" />
              </Form.Group>
              <Form.Group as={Col} sm={2} controlId={"streamDestPort" + stream.id}>
                <Form.Label>Destination Port</Form.Label>
                <Form.Control value={stream.destPort} onChange={this.handleChange} name="destPort" />
              </Form.Group>
              <Form.Group as={Col} sm={2} controlId={"streamState" + stream.id}>
                <Form.Label>Status</Form.Label>
                <Form.Control readOnly value={stream.state} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} sm={{ span: 6}} controlId={"streamType" + stream.id}>
                <Form.Label>Test Source</Form.Label>
                <Form.Control as="select" onChange={this.handleChange} name="type">
                  {TEST_SOURCES.map((src, idx) => {
                    return <option key={idx} value={src.id}>{src.description}</option>
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId={"streamAudioStreams" + stream.id}>
                <Form.Label>Audio Tracks</Form.Label>
                <Form.Control value={stream.audioStreams} onChange={this.handleChange} name="audioStreams" />                
              </Form.Group>
              <Form.Group controlId={"streamAudioChannels" + stream.id}>
                <Form.Label>Audio Channels (per track)</Form.Label>
                <Form.Control value={stream.channels} onChange={this.handleChange} name="channels" />                
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} sm={4} controlId={"action" + stream.id}>
                {stream.state === 'idle' ? 
                  <Button variant="success" onClick={this.handleStart.bind(this)}>START</Button> : 
                  <Button variant="danger" onClick={this.handleStop.bind(this)}>STOP</Button>
                }
              </Form.Group>
            </Form.Row>
            <hr/>
          </div>
        : null}
      </Form>
    )
  }
}
