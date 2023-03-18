import React from "react";
import mlbColors from "./teamcolors";

export default class BoxScore extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        items: [],
        awayColor: null,
        homeColor: null,
        totalInnings: 9
      };
    }
  
    componentDidMount() {
        this.interval = setInterval(() => this.pullData(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    pullData() {
        fetch("http://localhost:3001")
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
              items: result,
              awayColor: mlbColors[result.away_team.abbreviation],
              homeColor: mlbColors[result.home_team.abbreviation],
              totalInnings: totalInnings
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  
    render() {
      const { error, isLoaded, items, totalInnings, homeColor, awayColor } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        let innings = Array(totalInnings).fill(0);
        return (
            <div class="mlb-scores">
              <h2 class="boxscore__title">MLB</h2>
              <div class="boxscore">
                <div class="boxscore__team boxscore__team--header">
                  <label class="boxscore__label"></label>
                  <div class="boxscore__team__units">
                    {innings.map((inning, i) => (
                      <span>{i+1}</span>
                    ))}      
                    {/* {items.away_period_scores.map((item, i) => (
                        <span>{i+1}</span>
                      ))} */}
                  </div>
                  <div class="boxscore__team__results">
                    <span>R</span>
                    <span>H</span>
                    <span>E</span>
                  </div>
                </div>
                <div class="boxscore__team boxscore__team--away">
                  <label class="boxscore__label">{items.away_team.abbreviation}</label>
                  <div class="boxscore__team__units">
                      {innings.map((inning, i) => (
                        <span>{items.away_period_scores[i]}</span>
                      ))}
                  </div>
                  <div class="boxscore__team__results">
                    <span>{items.away_batter_totals.runs}</span>
                    <span>{items.away_batter_totals.hits}</span>
                    {/* <span>{items.away_period_scores.reduce((a,v) => a = a +v, 0)}</span>
                    <span>{items.away_batters.reduce((a,v) => a = a + v.hits, 0)}</span> */}
                    <span>{items.away_errors}</span>
                  </div>
                </div>
                <div class="boxscore__team boxscore__team--home">
                  <label class="boxscore__label">{items.home_team.abbreviation}</label>
                  <div class="boxscore__team__units">
                    {innings.map((inning, i) => (
                        <span>{items.home_period_scores[i]}</span>
                      ))}
                  </div>
                  <div class="boxscore__team__results">
                    <span>{items.home_batter_totals.runs}</span>
                    <span>{items.home_batter_totals.hits}</span>
                    <span>{items.home_errors}</span>
                  </div>
                </div>
                <div class="boxscore__details">
                  <div class="boxscore__details__team boxscore__details__team--away" style={{ background: awayColor}}>
                    <span class="boxscore__details__team__name">{items.away_team.last_name}</span>
                    <span class="boxscore__details__team__score">{items.away_batter_totals.runs}</span>
                  </div>
                  <div class="boxscore__details__info">
                    <strong>{items.side} {items.inning}</strong>
                  </div>
                  <div class="boxscore__details__team boxscore__details__team--home" style={{ background: homeColor}}>
                      <span class="boxscore__details__team__name">{items.home_team.last_name}</span>
                    <span class="boxscore__details__team__score">{items.home_batter_totals.runs}</span>
                  </div>
                </div>
              </div>
            </div>
        );
      }
    }
  }