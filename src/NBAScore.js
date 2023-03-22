import React from "react";
import { nbaFeed } from "./config";
import nbaColors from "./nbaColors";

export default class NBAScore extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        gData: [],
        awayColor: null,
        homeColor: null,
        overtime: false
      };
    }
  
    componentDidMount() {
        // Live update data every 15 seconds
        this.interval = setInterval(() => this.pullData(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    pullData() {
        fetch(nbaFeed)
        .then(res => res.json())
        .then(
          (result) => {
            if (result.event_information.status === "completed") result.status = "Final";
            else {
                result.status = result.away_period_scores.length;
                if (result.status > 4) result.status = 'OT';
                else if (result.status) result.status = 'Period ' + result.status;
                else result.status = 'Pregame';
            }
            this.setState({
              isLoaded: true,
              gData: result,
              overtime: result.away_period_scores.length > 4,
              awayColor: nbaColors[result.away_team.abbreviation],
              homeColor: nbaColors[result.home_team.abbreviation],
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
      const { error, isLoaded, gData, overtime, homeColor, awayColor } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div className="nba-scores">Loading NBA game...</div>;
      } else {
        let periods = Array(4).fill(0);
        if (overtime) periods.push(0);
        return (
            <div className="nba-scores">
              <h2 className="boxscore__title">NBA</h2>
              <div className="boxscore">
                <div className="boxscore__team boxscore__team--header">
                <label className="boxscore__label"></label>
                <div className="boxscore__team__units">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    {overtime &&
                        <span>OT</span>
                    }
                </div>
                <div className="boxscore__team__results">
                    <span>T</span>
                </div>
                </div>
                <div className="boxscore__team boxscore__team--away">
                <label className="boxscore__label">{gData.away_team.abbreviation}</label>
                <div className="boxscore__team__units">
                   <span>{gData.away_period_scores[0]}</span>
                   <span>{gData.away_period_scores[1]}</span>
                   <span>{gData.away_period_scores[2]}</span>
                   <span>{gData.away_period_scores[3]}</span>
                   {overtime &&
                        <span>{gData.away_period_scores[4]}</span>
                    }
                </div>
                <div className="boxscore__team__results">
                    <span>{gData.away_totals.points}</span>
                </div>
                </div>
                <div className="boxscore__team boxscore__team--home">
                <label className="boxscore__label">{gData.home_team.abbreviation}</label>
                <div className="boxscore__team__units">
                    <span>{gData.home_period_scores[0]}</span>
                    <span>{gData.home_period_scores[1]}</span>
                    <span>{gData.home_period_scores[2]}</span>
                    <span>{gData.home_period_scores[3]}</span>
                    {overtime &&
                            <span>{gData.home_period_scores[4]}</span>
                        }
                </div>
                <div className="boxscore__team__results">
                    <span>{gData.home_totals.points}</span>
                </div>
                </div>
                    <div className="boxscore__details">
                    <div className="boxscore__details__team boxscore__details__team--away" style={{ background: awayColor}}>
                        <span className="boxscore__details__team__name">{gData.away_team.last_name}</span>
                        <span className="boxscore__details__team__score">{gData.away_totals.points}</span>
                    </div>
                    <div className="boxscore__details__info">
                        <strong>{gData.status}</strong>
                    </div>
                    <div className="boxscore__details__team boxscore__details__team--home" style={{ background: homeColor}}>
                        <span className="boxscore__details__team__name">{gData.home_team.last_name}</span>
                        <span className="boxscore__details__team__score">{gData.home_totals.points}</span>
                    </div>
                    </div>
                </div>
            </div>
        );
      }
    }
  }