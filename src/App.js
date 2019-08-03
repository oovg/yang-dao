import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.scss';
import Routes from './Routes';
import Header from './components/header/Header';
import Loading from './components/shared/Loading';
import McDaoService from './utils/McDaoService';
import DaiService from './utils/DaiService';
import Web3Service from './utils/Web3Service';

const mcDao = new McDaoService();
const dai = new DaiService();
const web3 = new Web3Service();

const App = ({ client }) => {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    // save all web3 data to apollo cache
    const fetchData = async () => {
      const currentPeriod = await mcDao.getCurrentPeriod();
      const totalShares = await mcDao.getTotalShares();
      const guildBankAddr = await mcDao.getGuildBankAddr();
      const gracePeriodLength = await mcDao.getGracePeriodLength();
      const votingPeriodLength = await mcDao.getVotingPeriodLength();
      const periodDuration = await mcDao.getPeriodDuration();
      const processingReward = await mcDao.getProcessingReward();
      
      const proposalDeposit = await mcDao.getProposalDeposit();
      const guildBankValue = await dai.balanceOf(guildBankAddr);

      client.writeData({
        data: {
          currentPeriod: currentPeriod.toNumber(),
          totalShares: totalShares.toNumber(),
          guildBankAddr,
          gracePeriodLength: gracePeriodLength.toNumber(),
          votingPeriodLength: votingPeriodLength.toNumber(),
          periodDuration: periodDuration.toNumber(),
          processingReward: web3.fromWei(processingReward),
          proposalDeposit: web3.fromWei(proposalDeposit),
          guildBankValue: guildBankValue.toNumber(),
          shareValue: guildBankValue / totalShares,
        },
      });
      setloading(false);
    };

    fetchData();
  }, [client]);
  return (
    <div className="App">
      {loading ? (
        <Loading />
      ) : (
        <Router>
          <Header />
          <Routes />
        </Router>
      )}
    </div>
  );
};

export default App;
