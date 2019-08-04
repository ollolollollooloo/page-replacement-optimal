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
      {one: '', checked:false, found_in_given: true},
      {two: '', checked:false, found_in_given: true},
      {three: '', checked:false, found_in_given: true}
    ]

    // let turns       = 'one'
    let hit         = false
    let hit_count   = 0
    let fault_count = 0


    this.state.given.map(function(current_val, current_index) {
      let checkempty = false
      
      if(stack[0]['one'] === ""){
        stack[0]['one'] = current_val
        checkempty = true
      }else if(stack[1]['two'] === ""){
        stack[1]['two'] = current_val
        checkempty = true
      }else if(stack[2]['three'] === ""){
        stack[2]['three'] = current_val
        checkempty = true
      }else{
        // do nothing
      }

      if(!checkempty){
        if(stack[0]['one'] === current_val || stack[1]['two'] === current_val|| stack[2]['three'] === current_val){
          this.state.status_row.push({val: "✓"})
          hit = true
          hit_count += 1
        }else{
          this.state.status_row.push({val: "✘"})
          fault_count += 1
        }
      }else{
        this.state.status_row.push({val: "✘"})
        fault_count += 1
      }

      // Optimal LOGIC HERE
      let checked = 0
      if(!hit && !checkempty){
        let given_loop = true
        // Go in the future
        this.state.given.map(function(future_val, future_index){ 
          if(future_index > current_index){

                if(given_loop){
                  let stack_loop = true
                  
                  stack.map(function(stack_val, i){ 
                    if(stack_loop){
                      if(stack_val[this.inWords(i+1)] === this.state.given[future_index]){
                        stack[i]['checked'] = this.state.given[future_index]
                        if(stack[0]['checked']){ checked += 1 }
                        if(stack[1]['checked']){ checked += 1 }
                        if(stack[2]['checked']){ checked += 1 }
                        
                        if(checked === 3){
                          stack[i][this.inWords(i+1)] = this.state.given[future_index]
                          if(i===0){
                            stack[0]['one'] = current_val
                          }else if(i===1){
                            stack[1]['two'] = current_val
                          }else if(i===2){
                            stack[2]['three'] = current_val
                          }
                          stack_loop = false
                        }
                      }
                    }
                  }.bind(this))

                  if(checked === 3){
                    stack[0]['checked'] = false
                    stack[1]['checked'] = false
                    stack[2]['checked'] = false
                    given_loop = false
                  }else{
                    checked = 0
                  }
                }

              let end_of_loop = this.state.given.length;
              if(future_index ===(end_of_loop-1) && checked !== 3){
                if(!stack[0]['checked']){ 
                  stack[0]['one'] = current_val 
                  stack[0]['found_in_given'] = false
                }
                if(!stack[1]['checked']){ 
                  stack[1]['two'] = current_val 
                  stack[1]['found_in_given'] = false
                }
                if(!stack[2]['checked']){ 
                  stack[2]['three'] = current_val 
                  stack[2]['found_in_given'] = false
                }
              }
          }
        }.bind(this)) // End of future
      }

      // Lets do FIFO method
      if( (!stack[0]['found_in_given'] && !stack[1]['found_in_given']) || (!stack[0]['found_in_given'] && !stack[2]['found_in_given']) || (!stack[1]['found_in_given'] && !stack[2]['found_in_given']) ){
        // do the fifo method here
        let one_row = this.state.frame_one_row
        let two_row = this.state.frame_two_row
        let three_row = this.state.frame_three_row
        
        let one_count = 0
        let two_count = 0
        let three_count = 0
        
        // eslint-disable-next-line
        one_row.map(function(one_row_val, one_row_index){ 
          if(this.state.frame_one_row[current_index-1].val === one_row_val.val){
            one_count += 1
          }
        }.bind(this))
        // eslint-disable-next-line
        two_row.map(function(two_row_val, two_row_i){ 
          if(this.state.frame_two_row[current_index-1].val === two_row_val.val){
            two_count += 1
          }
        }.bind(this))
        // eslint-disable-next-line
        three_row.map(function(three_row_val, three_row_i){ 
          if(this.state.frame_three_row[current_index-1].val === three_row_val.val){
            three_count += 1
          }
        }.bind(this))
       
        if(one_count>two_count && one_count>three_count) {
          // 1 is greates
          stack[0]['one']   = current_val
          stack[1]['two']   = this.state.frame_two_row[current_index-1].val
          stack[2]['three'] = this.state.frame_three_row[current_index-1].val
        }else if(two_count>one_count && two_count>three_count) {
          // 2 is greates
          stack[0]['one']   = this.state.frame_one_row[current_index-1].val
          stack[1]['two']   = current_val
          stack[2]['three'] = this.state.frame_three_row[current_index-1].val
        }else if(three_count>one_count && three_count>one_count) {
          // 3 is greates
          stack[0]['one']   = this.state.frame_one_row[current_index-1].val
          stack[1]['two']   = this.state.frame_two_row[current_index-1].val
          stack[2]['three'] = current_val
        }
      } // end of fifo method

      // Reset values
      hit = false

      this.state.frame_one_row.push({val:stack[0]['one']})
      this.state.frame_two_row.push({val:stack[1]['two']})
      this.state.frame_three_row.push({val:stack[2]['three'] })

    }.bind(this))


    this.setState({hit_count:hit_count})
    this.setState({fault_count:fault_count})
    
    let interval_time = this.state.given.length*2

    setTimeout(function(){ 
      this.setState({loading:false}) 
    }.bind(this), interval_time*1000)
  }

  updateGiven(val,i){
    let o = this.state.given

    let int = parseInt(val)

    if(Number.isInteger(int) && int !== ''){
      if(int > 0){
        int = String(int).charAt(0)
        int = Number(int)
        o[i] = int
        this.setState({given:o}) 
      }
    }
  }


  addGiven(e){
    e.preventDefault()
    let o = this.state.given

    if(this.state.addnew > 0){
        o.push(parseInt(this.state.addnew[0])) 
    }
    this.setState({'addnew':0})
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
                          onChange={(e) => this.updateGiven(e.target.value, i)}
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
