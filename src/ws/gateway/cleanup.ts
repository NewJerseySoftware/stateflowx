export async function removeSocketIdFromPlayersWatchersArray(
  socketid: string,
  _id: string,
  tableModel: any,
) {
  const document = await tableModel.findById(_id).exec();

  try {
    if (_id) {
      // maybe dumped data right before cleanup testing...
      if (document) {
        const playersIndex = document.players.indexOf(socketid);
        if (playersIndex !== -1) {
          document.players.splice(playersIndex, 1);
        }

        const watchersIndex = document.watchers.indexOf(socketid);
        if (watchersIndex !== -1) {
          document.watchers.splice(watchersIndex, 1);
        }

        await document.save();
      }
    }
  } catch (error) {
    console.log('cleanup error remove socket from players array: ' + error);
  }
}

export async function removeSeatMapValue(
  _id: string,
  socketid: string,
  gameModel: any,
) {
  try {
    console.log('REMOVE SEAT: ' + _id);
    if (_id) {
      const game = await gameModel.findById(_id);
      if (game && game.seats instanceof Map) {
        for (const [seat, value] of game.seats.entries()) {
          if (value === socketid) {
            game.seats.delete(seat);
            // if (game.seats.size === 0) {
            //   await gameModel.findByIdAndUpdate(_id, { active: false });
            // }
            await game.save();
            break;
          }
        }
      }
    }
  } catch (error) {
    console.log('error removing seat: ', error);
  }
}

/* is mongodb standard id type */
function is12ByteHex(value: string | any[]) {
  // Check if the value is a string of 24 characters
  if (typeof value !== 'string' || value.length !== 24) {
    return false;
  }

  // Check if the value is a valid hexadecimal string
  const hexRegex = /^[0-9a-fA-F]{24}$/;
  return hexRegex.test(value);
}
