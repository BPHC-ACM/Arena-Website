let wsInstance = null;

const initialize = (ws) => {
  wsInstance = ws;
};

const emitCricketUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "cricket_update", data }));
      }
    });
  }
};

const emitBasketballUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "basketball_update", data }));
      }
    });
  }
};

const emitFootballUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "football_update", data }));
      }
    });
  }
};

const emitTennisUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "tennis_update", data }));
      }
    });
  }
};

const emitBadmintonUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "badminton_update", data }));
      }
    });
  }
};

const emitVolleyballUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "volleyball_update", data }));
      }
    });
  }
};

const emitKabaddiUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "kabaddi_update", data }));
      }
    });
  }
};

const emitFrisbeeUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "frisbee_update", data }));
      }
    });
  }
};

module.exports = {
  initialize,
  emitCricketUpdate,
  emitBasketballUpdate,
  emitFootballUpdate,
  emitTennisUpdate,
  emitBadmintonUpdate,
  emitVolleyballUpdate,
  emitKabaddiUpdate,
  emitFrisbeeUpdate,
};
