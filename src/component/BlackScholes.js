import React, { Component } from "react";
import "./BlackScholes.css";
import CallOption from "./option/CallOption";
import PutOption from "./option/PutOption";
var NormalDistribution = require("normal-distribution").default;

export default class BlackScholes extends Component {
  state = {
    strikePrice: "",
    stokePrice: "",
    riskFreeRate: "",
    expiryTime: "",
    voladitiy: "",
    callOption: "",
    putOption: "",
    show: false,
  };

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  calculateStandardNormalDistrubutionForD1 = () => {
    let stokePrice = this.state.stokePrice;
    let strikePrice = this.state.strikePrice;
    let voladitiy = this.state.voladitiy;
    let expiry = this.state.expiryTime;
    let rate = this.state.riskFreeRate;
    voladitiy = voladitiy / 100;
    rate = rate / 100;
    let num =
      Math.log(stokePrice / strikePrice) +
      [rate + Math.pow(voladitiy, 2) / 2] * expiry;
    let dem = voladitiy * Math.sqrt(expiry);
    let d1 = num / dem;
    const normDist = new NormalDistribution(0, 1);
    let stdNormD1 = normDist.cdf(d1);
    return stdNormD1;
  };

  calculateStandardNormalDistrubutionForD2 = (dOne) => {
    let voladitiy = this.state.voladitiy;
    let expiry = this.state.expiryTime;
    voladitiy = voladitiy / 100;
    let dem = voladitiy * Math.sqrt(expiry);
    let d2 = dOne - dem;
    const normDist = new NormalDistribution(0, 1);
    let stdNormD2 = normDist.cdf(d2);
    return stdNormD2;
  };
  calculateCallOption(normDistOne, normDistTwo) {
    let stokePrice = this.state.stokePrice;
    let strikePrice = this.state.strikePrice;
    let rate = this.state.riskFreeRate;
    let expiry = this.state.expiryTime;
    rate = rate / 100;
    // c = [S N (d1)] - [E/e rt] N (d2) ]
    let callOption =
      stokePrice * normDistOne -
      [strikePrice / Math.exp(rate * expiry)] * normDistTwo;
    return callOption;
  }

  calculatePutOption(callOption) {
    let stokePrice = this.state.stokePrice;
    let strikePrice = this.state.strikePrice;
    let rate = this.state.riskFreeRate;
    let expiry = this.state.expiryTime;
    rate = rate / 100;
    // p = C + PV(E) - S

    let valueStandardPrice =
      [strikePrice / Math.exp(rate * expiry)] - stokePrice;
    let putOption = callOption + valueStandardPrice;
    return putOption;
  }

  handleSubmit(event) {
    event.preventDefault();
    let normDistOne = this.calculateStandardNormalDistrubutionForD1();
    let normDistTwo = this.calculateStandardNormalDistrubutionForD2(
      normDistOne
    );
    let callOption = this.calculateCallOption(normDistOne, normDistTwo);
    let putOption = this.calculatePutOption(callOption);
    this.setState({
      callOption: callOption,
      putOption: putOption,
      show: true,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="header">
            Black & Scholes Model for Call Option Pricing valuation
          </div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">
              <div className="col-25">
                <label>STRIKE: </label>
              </div>
              <div className="col-75">
                <input
                  type="number"
                  name="strikePrice"
                  value={this.state.strikePrice}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label>SPOT:</label>
              </div>
              <div className="col-75">
                <input
                  type="number"
                  name="stokePrice"
                  value={this.state.stokePrice}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label>INTEREST:</label>
              </div>
              <div className="col-75">
                <input
                  type="number"
                  name="riskFreeRate"
                  value={this.state.riskFreeRate}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
              <pre>(%)</pre>
            </div>
            <div className="row">
              <div className="col-25">
                <label>EXPIRY:</label>
              </div>
              <div className="col-75">
                <input
                  type="number"
                  name="expiryTime"
                  value={this.state.expiryTime}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
              <pre>(in year)</pre>
            </div>

            <div className="row">
              <div className="col-25">
                <label>VOLATILITY:</label>
              </div>
              <div className="col-75">
                <input
                  type="number"
                  name="voladitiy"
                  value={this.state.voladitiy}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
              <pre>(%)</pre>
            </div>
            <div className="row">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
        {this.state.show ? <CallOption call={this.state.callOption} /> : null}
        {this.state.show ? <PutOption put={this.state.putOption} /> : null}
      </React.Fragment>
    );
  }
}
