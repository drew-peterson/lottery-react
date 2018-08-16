import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    from: ''
  };
  async componentDidMount() {
    // when using metamask provider & .call we dont have to specifiy from prop
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address); // object wrapped in bigNumber.js
    const from = await web3.eth.getAccounts();
    this.setState({
      manager,
      players,
      balance,
      from: from[0]
    });
  }

  // dont have to wory on .bind(this) with this special syntax from babel
  onSubmit = async event => {
    event.preventDefault();
    const { value, from } = this.state;

    this.setState({ message: 'Waiting on message success....' });
    try {
      await lottery.methods
        .enter()
        .send({ from, value: web3.utils.toWei(value, 'ether') }); // use send for transactions

      this.setState({ message: 'You have been entered!' });
    } catch (err) {
      console.log('err', err);
      // this.setState({ value: '' });
      this.setState({ message: 'error occured' });
    }
  };

  pickWinner = async () => {
    const { from } = this.state;
    this.setState({ message: 'Waiting on transaction sucess...' });
    await lottery.methods.pickWinner().send({ from });
    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    const { manager, players, balance, value, message, from } = this.state;
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by: {manager}. There are currently{' '}
          {players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(balance, 'ether')} ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck</h4>
          <div>
            <label htmlFor="">Amount of ether to enter:</label>
            <input
              type="text"
              value={value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        {from === manager && (
          <div>
            <hr />
            <h4>Ready to pick a winner?</h4>
            <button onClick={this.pickWinner}>Pick Winner</button>
          </div>
        )}
        <hr />
        <h1>{message}</h1>
      </div>
    );
  }
}

export default App;
