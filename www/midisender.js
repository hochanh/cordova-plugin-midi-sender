var exec = require("cordova/exec");

var MIDISender = function () {};

/**
 * @param {number} channelNum 0-15
 * @param {number} programNum 1-128
 * @return {void}
 */
MIDISender.sendProgramChange = function (channelNum, programNum) {
  // add 192 for the 192-207 program change range
  channelNum = parseInt(channelNum) + 191;

  exec(
    function () {},
    function () {},
    "MIDISender",
    "sendProgramChange",
    [channelNum, programNum]
  );
};
MIDISender.sendNote = function (channelNum, programNum, valueNum) {
  channelNum = parseInt(channelNum) + 143;
  exec(
    function () {},
    function () {},
    "MIDISender",
    "sendNote",
    [channelNum, programNum, valueNum]
  );
};
MIDISender.sendControlChange = function (channelNum, programNum, valueNum) {
  channelNum = parseInt(channelNum) + 175;
  exec(
    function () {},
    function () {},
    "MIDISender",
    "sendControlChange",
    [channelNum, programNum, valueNum]
  );
};

/**
 * @param {function} callback
 * @return {void}
 */
MIDISender.getIncoming = function (callback) {
  exec(
    function (data) {
      var dc = parseInt(data.channel);
      if (dc > 191 && dc < 208) {
        // Program Change
        data.channel = dc - 192;
        data.type = "Program Change";
      } else if (dc > 143 && dc < 160) {
        // Note
        data.channel = dc - 143;
        data.type = parseInt(data.value) > 0 ? "Note On" : "Note Off";
      } else if (dc > 175 && dc < 192) {
        // CC
        data.channel = dc - 175;
        data.type = "Control Change";
      } else if (dc === 128) {
        data.channel = dc - 127;
        data.type = "Note Off";
      } else {
        data.channel = dc;
        data.type = "Unknown";
      }

      callback.call(this, data);
    },
    function () {},
    "MIDISender",
    "getIncoming",
    {}
  );
};

module.exports = MIDISender;
