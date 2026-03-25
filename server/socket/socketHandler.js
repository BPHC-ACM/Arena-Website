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

const emitCarromUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "carrom_update", data }));
      }
    });
  }
};

const emitChessUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "chess_update", data }));
      }
    });
  }
};

const emitHockeyUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "hockey_update", data }));
      }
    });
  }
};

const emitKhoKhoUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "khokho_update", data }));
      }
    });
  }
};

const emitPowerliftingUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "powerlifting_update", data }));
      }
    });
  }
};

const emitSkatingUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "skating_update", data }));
      }
    });
  }
};

const emitEightBallUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "8ball_update", data }));
      }
    });
  }
};

const emitSnookerUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "snooker_update", data }));
      }
    });
  }
};

const emitSquashUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "squash_update", data }));
      }
    });
  }
};

const emitSwimmingUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "swimming_update", data }));
      }
    });
  }
};

const emitTableTennisUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "tabletennis_update", data }));
      }
    });
  }
};

const emitThrowballUpdate = (data) => {
  if (wsInstance) {
    wsInstance.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: "throwball_update", data }));
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
  emitCarromUpdate,
  emitChessUpdate,
  emitHockeyUpdate,
  emitKhoKhoUpdate,
  emitPowerliftingUpdate,
  emitSkatingUpdate,
  emitEightBallUpdate,
  emitSnookerUpdate,
  emitSquashUpdate,
  emitSwimmingUpdate,
  emitTableTennisUpdate,
  emitThrowballUpdate,
};
