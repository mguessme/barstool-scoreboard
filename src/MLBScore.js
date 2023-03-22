import React from "react";
import { mlbFeed } from "./config";
import mlbColors from "./mlbColors";

export default class MLBScore extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        gData: [],
        awayColor: null,
        homeColor: null,
        totalInnings: 9
      };
    }
  
    componentDidMount() {
        // Live update data every 15 seconds
        this.interval = setInterval(() => this.pullData(), 15000); 
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    pullData() {
        fetch(mlbFeed)
        .then(res => res.json())
        .then(
          (result) => {
            let halves = result.away_period_scores.length + result.home_period_scores.length;
            let inning = Math.ceil(halves/2);
            let totalInnings = Math.max(inning, 9);
            if (result.event_information.status === "completed") result.inning = "Final";
            else {
              let side = "Bot";
              if (halves%2) side = "Top";
              result.inning = side + ' ' + inning;
            }
            this.setState({
              isLoaded: true,
              gData: result,
              awayColor: mlbColors[result.away_team.abbreviation],
              homeColor: mlbColors[result.home_team.abbreviation],
              totalInnings: totalInnings
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  
    render() {
      const { error, isLoaded, gData, totalInnings, homeColor, awayColor } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div className="mlb-scores">Loading MLB game...</div>;
      } else {
        let innings = Array(totalInnings).fill(0);
        return (
            <div className="mlb-scores">
              <h2 className="boxscore__title">MLB</h2>
              <div className="boxscore-wrapper">
                <div className="boxscore">
                  <div className="boxscore__team boxscore__team--header">
                    <label className="boxscore__label"></label>
                    <div className="boxscore__team__units">
                      {innings.map((inning, i) => (
                        <span key={i}>{i+1}</span>
                      ))}      
                    </div>
                    <div className="boxscore__team__results">
                      <span>R</span>
                      <span>H</span>
                      <span>E</span>
                    </div>
                  </div>
                  <div className="boxscore__team boxscore__team--away">
                    <label className="boxscore__label">{gData.away_team.abbreviation}</label>
                    <div className="boxscore__team__units">
                        {innings.map((inning, i) => (
                          <span key={i}>{gData.away_period_scores[i]}</span>
                        ))}
                    </div>
                    <div className="boxscore__team__results">
                      <span>{gData.away_batter_totals.runs}</span>
                      <span>{gData.away_batter_totals.hits}</span>
                      <span>{gData.away_errors}</span>
                    </div>
                  </div>
                  <div className="boxscore__team boxscore__team--home">
                    <label className="boxscore__label">{gData.home_team.abbreviation}</label>
                    <div className="boxscore__team__units">
                      {innings.map((inning, i) => (
                          <span key={i}>{gData.home_period_scores[i]}</span>
                        ))}
                    </div>
                    <div className="boxscore__team__results">
                      <span>{gData.home_batter_totals.runs}</span>
                      <span>{gData.home_batter_totals.hits}</span>
                      <span>{gData.home_errors}</span>
                    </div>
                  </div>
                  <div className="boxscore__details">
                    <div className="boxscore__details__team boxscore__details__team--away" style={{ background: awayColor}}>
                      <span className="boxscore__details__team__name">{gData.away_team.last_name}</span>
                      <span className="boxscore__details__team__score">{gData.away_batter_totals.runs}</span>
                    </div>
                    <div className="boxscore__details__info">
                      <strong>{gData.side} {gData.inning}</strong>
                    </div>
                    <div className="boxscore__details__team boxscore__details__team--home" style={{ background: homeColor}}>
                        <span className="boxscore__details__team__name">{gData.home_team.last_name}</span>
                      <span className="boxscore__details__team__score">{gData.home_batter_totals.runs}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
      }
    }
  }