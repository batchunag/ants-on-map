import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import './App.scss'
import { Button, Modal } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Marker from './components/marker'
import stravaLocation from './lib/stravaLocation'

const history = createBrowserHistory()

interface Coordinate {
  lat: number
  lng: number
}

interface Runner extends Coordinate {
  color?: string
}

interface State {
  center: Coordinate
  runners: { [name: string]: Runner }
  loaded: boolean
  modal: boolean
  runner: { name: string; link: string }
}

const timeouts: { [name: string]: any } = {}

export default class App extends Component<{ apiKey: string; zoom: number }, State> {
  static get defaultProps() {
    return {
      apiKey: 'AIzaSyBqZzSsoq_PypxuEsvlq7UhMcdtzGSr8Zk',
      zoom: 12,
    }
  }

  constructor(props: any) {
    super(props)

    this.state = {
      center: {
        lat: 59.95,
        lng: 30.33,
      },
      runners: {},
      modal: false,
      loaded: false,
      runner: {
        name: '',
        link: '',
      },
    }
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          loaded: true,
        })
        this.startTracking()
      })
    }
  }

  static getQuery() {
    const query = new URLSearchParams(window.location.search)
    const params: { [name: string]: string } = JSON.parse(query.get('q') ?? '{}')
    return params
  }

  addLink = async () => {
    const id = this.state.runner.link.replace(/(^.+beacon\/)|(\?.+)/g, '')
    const query = App.getQuery()
    query[this.state.runner.name] = id
    history.push(`/?q=${encodeURIComponent(JSON.stringify(query))}`)
    this.hideModal()
    this.startTracking()
  }

  handleName = (event: any) => {
    const { runner } = this.state
    this.setState({ runner: { ...runner, name: event.target.value } })
  }

  handleLink = (event: any) => {
    const { runner } = this.state
    this.setState({ runner: { ...runner, link: event.target.value } })
  }

  hideModal = () => {
    this.setState({ modal: false, runner: { name: '', link: '' } })
  }

  showModal = () => {
    this.setState({ modal: true })
  }

  startTracking = () => {
    const query = App.getQuery()
    Object.entries(query).forEach(([name, id]) => this.startTrackingRunner(name, id))
  }

  startTrackingRunner = (name: string, id: string) => {
    clearTimeout(timeouts[name])
    this.trackRunner(name, id)
  }

  trackRunner = (name: string, id: string) => {
    const { runners } = this.state
    timeouts[name] = setTimeout(async () => {
      const location = await stravaLocation(id)
      if (location.streams.latlng?.length) {
        const [lat, lng] = location.streams.latlng[location.streams.latlng.length - 1]
        this.setState({
          runners: { ...runners, [name]: { lat, lng } },
        })
      }
      this.trackRunner(name, id)
    }, 6000)
  }

  renderMarkers() {
    return Object.entries(this.state.runners).map(([name, { lat, lng, color }]) => {
      return <Marker lat={lat} lng={lng} name={name} color={color} key={name} />
    })
  }

  renderModal() {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <Modal show={this.state.modal} onHide={this.hideModal}>
              <Modal.Header>Add runner beacon link</Modal.Header>
              <Modal.Body>
                <input
                  type="text"
                  placeholder="name"
                  onChange={this.handleName}
                  value={this.state.runner.name}
                />
                <input
                  type="text"
                  placeholder="https://strava.com/..."
                  onChange={this.handleLink}
                  value={this.state.runner.link}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.hideModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={this.addLink}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </Route>
        </Switch>
      </Router>
    )
  }

  renderBody() {
    const { loaded, center } = this.state
    if (!loaded) {
      return <div className="loadPage">loading</div>
    }

    const { apiKey, zoom } = this.props

    return (
      <div>
        <div className="mapContainer">
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultCenter={center}
            defaultZoom={zoom}
          >
            {this.renderMarkers()}
          </GoogleMapReact>
        </div>
        <div className="p-2">
          <Button onClick={this.showModal}>Add runner link</Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <header className="appHeader">
          <div className="appHeader-title">RunnerMap - RunAntsRun</div>
        </header>
        {this.renderModal()}
        {this.renderBody()}
      </div>
    )
  }
}
