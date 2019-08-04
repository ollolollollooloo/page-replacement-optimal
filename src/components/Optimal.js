import React , { Component } from 'react'
import Typing from 'react-typing-animation';


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
      hit_count: 0,
      fault_count: 0,
      addnew: 0,

      frame_one_row: [],
      frame_two_row: [],
      frame_three_row: [],
      status_row: [],
    }

    this.addGiven = this.addGiven.bind(this)
    this.updateGiven = this.updateGiven.bind(this)
    this.runSimulation = this.runSimulation.bind(this)
    this.inWords = this.inWords.bind(this)
  }

  componentDidMount(){
    // do nothing
  }

  runSimulation(e){
    e.preventDefault()
    this.setState({loading:true})
    let stack = [
      {one: '',checked:false},
      {two: '',checked:false},
      {three: '',checked:false}
    ]

    let hit = false

    this.state.given.map(function(val, i) {
      var current_val = val
      let checkempty = false
      
      if(stack[0]['one'] === ""){
        stack[0]['one'] = val
        checkempty = true
      }else if(stack[1]['two'] === ""){
        stack[1]['two'] = val
        checkempty = true
      }else if(stack[2]['three'] === ""){
        stack[2]['three'] = val
        checkempty = true
      }else{
        // do nothing
      }

      if(!checkempty){
        if(stack[0]['one'] === val || stack[1]['two'] === val|| stack[2]['three'] === val){
          this.state.status_row.push({val: "✓"})
          hit = true
        }else{
          this.state.status_row.push({val: "✘"})
        }
      }else{
        this.state.status_row.push({val: "✘"})
      }

      // LRU LOGIC HERE
      let checked = 0
      if(!hit && !checkempty){
        var given_loop = true
        // Go in the future
        console.log('-----loop start-----')
        // for (let x = i+1; x < this.state.given.length; x++) { 
        this.state.given.forEach(function(val, x){ 
          if(x > i){
                console.log(this.state.given[x])

                if(given_loop){
                  var stack_loop = true
                  
                  // eslint-disable-next-line
                  // stack.map(function(val, i){
                  stack.forEach(function(val, i){ 
                    if(stack_loop){
                      if(val[this.inWords(i+1)] === this.state.given[x]){
                        if(stack[0]['checked']){ checked += 1; console.log('cehcked '+checked)}
                        if(stack[1]['checked']){ checked += 1; console.log('cehcked '+checked)}
                        if(stack[2]['checked']){ checked += 1; console.log('cehcked '+checked)}
                        
                        if(checked === 3){
                          stack[i][this.inWords(i+1)] = this.state.given[x]
                          if(i===0){
                            stack[0]['one'] = current_val
                          }else if(i===1){
                            stack[1]['two'] = current_val
                          }else if(i===3){
                            stack[2]['three'] = current_val
                          }
                          stack_loop = false
                          console.log('matched! '+this.state.given[x]+' replace stack '+i)
                        }

                        stack[i]['checked'] = true
                      }
                    }
                  }.bind(this))

                  if(checked === 3){
                    stack[0]['checked'] = false
                    stack[1]['checked'] = false
                    stack[2]['checked'] = false
                    given_loop = false
                  }
                }
          }
        }.bind(this)) // End of future
        console.log('-----loop end-----')

      }

      this.state.frame_one_row.push({val:stack[0]['one']})
      this.state.frame_two_row.push({val:stack[1]['two']})
      this.state.frame_three_row.push({val:stack[2]['three'] })

      hit = false
      this.setState({loading:false})
    }.bind(this))
  }

  updateGiven(e, val,i){
    e.preventDefault()
    let o = this.state.given
    o[i] = val
    this.setState({o}) 
    console.log(val)
    // console.log(val)
    // console.log(i)
  }

  addGiven(e){
    e.preventDefault()
    let o = this.state.given

    if(this.state.addnew > 0){
        o.push(parseInt(this.state.addnew[0])) 
    }
    this.setState({'addnew':0})
    console.log(o)
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

          <div style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', padding: '30px 30px'}}>
            <div className="row">
              <h1>Memory Management Program Simulation</h1>
              <h2 style={{color:'green'}}>Page Replacement Optimal</h2>
            </div>
            <br/>
            <div className="row">
                <label>Given</label>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <form className="form-inline">
                  {
                    this.state.given.map((val, i) =>
                      <div key={i} className="input-group mb-1 mr-sm-1" style={{width: '85px'}}>
                        <div className="input-group-prepend">
                          <div className="input-group-text" style={{fontSize: '10px'}}>{i}</div>
                        </div>
                        <input type="number" className="form-control" 
                          value={val}
                          onChange={(e) => this.updateGiven(e, val, i)}
                        />
                      </div>
                    )
                  }

                  <div className="input-group mb-1 mr-sm-1"  style={{width: '85px'}}>
                    <div className="input-group-prepend">
                      <div className="input-group-text" style={{fontSize: '10px'}}>{this.state.given.length+1}</div>
                    </div>
                    <input type="number" className="form-control" 
                      value={this.state.addnew}
                      onChange={(e) => this.setState({'addnew':e.target.value})}
                    />
                  </div>
                  <button onClick={(e) => this.addGiven(e)} type="submit" className="btn btn-outline-success my-2 btn-sm">+</button>
                </form>
              </div>
            </div>
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
                              {
                                val.val === '✓' ?
                                <span style={{color: 'green'}}>{val.val}</span> : 
                                <span style={{color: 'red'}}>{val.val}</span>
                              }
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
              <h4>Number of Hit Ratio = {this.state.hit_count}</h4>
            </div>
            <div className="row">
              <h4>Number of Page Faults = {this.state.fault_count}</h4>
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
          
          <br/><br/>

          <blockquote className="blockquote text-right">
            <p className="mb-0"><a href="https://www.youtube.com/watch?v=DXU7SqsYDvg&t=821s">Page Replacement Algorithms | LRU and optimal | Operating Systems</a></p>
            <footer className="blockquote-footer">Credits to <cite title="Source Title">Jenny's lectures CS/IT NET&JRF</cite></footer>
          </blockquote>

          <br/><br/>

          <blockquote className="blockquote text-right">
            <p className="mb-0"><a href="https://github.com/kenntinio/page-replacement-optimal">Page Replacement Optimal - Memory Management Program Simulation</a></p>
            <footer className="blockquote-footer">Develop by <cite title="Source Title"><a href="https://github.com/kenntinio">Kenn Tinio</a></cite></footer>
          </blockquote>
      </div>
      )
  }
}

export default Optimal
