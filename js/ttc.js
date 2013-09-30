var init = function() {
    var board = new ChessBoard('board', {
        draggable: true,
        sparePieces: true
    });
}; // end init()

$(document).ready(init);
