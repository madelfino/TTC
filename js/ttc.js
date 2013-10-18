var DEBUG = false,
    board,
    turn;

var onDrop = function(source, target, piece, newPos, oldPos, orient) {
    if (DEBUG) $('#title').html('source: ' + source +
                                '<br>target: ' + target +
                                '<br>piece: ' + piece +
                                '<br>newPos: ' + JSON.stringify(newPos) +
                                '<br>oldPos: ' + JSON.stringify(oldPos) +
                                '<br>orient: ' + orient +
                                '<br>turn: ' + turn +
                                '<br>piece[0]: ' + piece[0]);
    for (square1 in newPos) {
        for (square2 in newPos) {
            if (newPos[square1] == newPos[square2] && square1 != square2)
                return 'snapback';
        }
    }
    if (piece[0] != turn || JSON.stringify(newPos) == JSON.stringify(oldPos)) return 'snapback';
    if (turn == 'w') {
        turn = 'b';
    } else {
        turn = 'w';
    }
}; //end onDrop()

var init = function() {
    board = new ChessBoard('board', {
        draggable: true,
        sparePieces: true,
        onDrop: onDrop
    });
    turn = 'w';
}; // end init()

$(document).ready(init);
