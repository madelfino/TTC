var DEBUG = false,
    board;

var onDrop = function(source, target, piece, newPos, oldPos, orient) {
    if (DEBUG) $('#title').html('source: ' + source + '<br>target: ' + target + '<br>piece: ' + piece + '<br>newPos: ' + JSON.stringify(newPos) + '<br>oldPos: ' + JSON.stringify(oldPos) + '<br>orient: ' + orient);
    for (square1 in newPos) {
        for (square2 in newPos) {
            if (newPos[square1] == newPos[square2] && square1 != square2)
                return 'snapback';
        }
    }
}; //end onDrop()

var init = function() {
    board = new ChessBoard('board', {
        draggable: true,
        sparePieces: true,
        onDrop: onDrop
    });
}; // end init()

$(document).ready(init);
