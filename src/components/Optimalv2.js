import React , { Component } from 'react'
import Typing from 'react-typing-animation';
import axios from 'axios';

class Optimal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fifo: '',
      loading: false,
      given: [3,2,1,3,4,1,6,2,4,3,4,2,1,4,5,2,1,3,4],
      frames:[0,1,2],
      a: ['zero','one','two','three','fourth','five','six','seven','eight','nine','ten'],
      b: ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'],

      frame_one_row: [],
      frame_two_row: [],
      frame_three_row: [],
      status_row: [],
      hit_count: 0,
    }

    this.runSimulation = this.runSimulation.bind(this)
    this.inWords = this.inWords.bind(this)
  }

  componentDidMount(){
    // do nothing
  }

  runSimulation(e){
    e.preventDefault()
    this.setState({loading:true})
    

    axios.get('http://localhost:8000/optimal').then(function (response) {
      // let o = JSON.parse(response)
      this.setState({frame_one_row:response.data.frame_one_row})
      this.setState({frame_two_row:response.data.frame_two_row})
      this.setState({frame_three_row:response.data.frame_three_row})
      this.setState({status_row:response.data.status_row})
      this.setState({hit_count:response.data.hit})
      // o = JSON.parse(o)
      console.log(response)
      this.setState({loading:false})
    }.bind(this)).catch(function (error) {
      console.log(error)
      this.setState({loading:false})
    }.bind(this))
  }

  inWords (num) {
    let a = this.state.a
    let b = this.state.b
    if ((num = num.toString()).length > 9) return 'overflow'
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n) return; var str = ''
    str += (n[5] !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''
    
    return str
  }

  render() {
      return(
      <div>
          <br/>
          <br/>
          <br/>
          <div className="row">
            <h1>Memory Management Program Simulation</h1>
            <h2 style={{color:'green'}}>Page Replacement Optima</h2>
          </div>
          <br/>
          <br/>
          <div className="row">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Request</th>
                  {
                    this.state.given.map((val, key) =>
                      <th key={key} scope="col">{val}</th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Frame 1</td>
                  {
                    this.state.frame_one_row.map((val, key)=>
                      <td key={key}>
                        {
                          (val.val) ? <Typing hideCursor={true}><div> <Typing.Delay  ms={key*1000} /> {val.val} </div> </Typing> : ''
                        }
                      </td>
                    )
                  }
                </tr>
                <tr>
                  <td>Frame 2</td>
                  {
                    this.state.frame_two_row.map((val, key)=>
                      <td key={key}>
                        {
                          (val.val) ? <Typing hideCursor={true}><div> <Typing.Delay ms={key*1000} /> {val.val} </div> </Typing> : ''
                        }
                      </td>
                    )
                  }
                </tr>
                <tr>
                  <td>Frame 3</td>
                  {
                    this.state.frame_three_row.map((val, key)=>
                      <td key={key}>
                        {
                          (val.val) ? <Typing hideCursor={true}><div> <Typing.Delay ms={key*1000} /> {val.val} </div> </Typing> : ''
                        }
                      </td>
                    )
                  }
                </tr>
                <tr>
                  <td>Status</td>
                  {
                    this.state.status_row.map((val, key)=>
                      <td key={key}>
                       <Typing hideCursor={true}>
                          <div>
                            <Typing.Delay ms={key*2000} />
                            {val.val}
                          </div>
                        </Typing>
                      </td>
                    )
                  }
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
          {
            this.state.loading ? 
            <button type="button" className="btn btn-dark" disabled> <i className="fas fa-cog fa-spin"></i> Run Simulation</button>
            :
            <button type="button" className="btn btn-dark" onClick={this.runSimulation}>Run Simulation</button>
          }
          </div>
          <br/>
          <br/>
          <div className="row">
            <h4>Number of Page Faults in Optimal Page Replacement Algorithm = {this.state.hit_count}</h4>
          </div>
          <br/>
          <br/>
          {
            this.state.loading &&
              <div className="row">
                <div className="col-sm">
                </div>
                <div className="col-sm">
                  <img alt="loading.." src="./source.gif" width="100%"/>
                </div>
                <div className="col-sm">
                </div>
              </div>
          }
      </div>
      )
  }
}

export default Optimal
