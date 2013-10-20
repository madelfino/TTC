var DEBUG = false,
    board,
    turn;

function piece_color(piece) {
    if ('RNBP'.indexOf(piece) != -1) return 'white';
    if ('rnbp'.indexOf(piece) != -1) return 'black';
    return 'invalid';
} //end piece_color(piece)

function winner() {
    var i = 0, j, k,
        cur = '',
        cur_num = 0,
        the_winner = 'none',
        piece_colors = [],
        col = [], diag1 = [], diag2 = [],
        position = board.fen().split('/');

    function check_row(row) {
        return (row.length == 4 && row[0] == row[1] && row[1] == row[2] && row[2] == row[3]) ? row[0] : 'none';
    } //end check_row()

    while (i < 16) {
        if (i%4 == 0) k = 0;
        cur = position[Math.floor(i/4)][i%4-k]
        cur_num = parseInt(cur);
        if (isNaN(cur_num)) {
            piece_colors[i] = piece_color(cur);
            i++;
        } else {
            for (j=0; j<cur_num; j++) {
                piece_colors[i] = 'none';
                k++;
                i++;
            }
            k -= 1;
        }
    }

    for (i=0; i<4; i++) {
        col = [];
        diag1[i] = piece_colors[i*4+i];
        diag2[i] = piece_colors[i*4+3-i];
        for (j=0; j<4; j++) {
            col[j] = piece_colors[j*4+i];
        }
        the_winner = check_row(piece_colors.slice(i*4, i*4+4));
        if (the_winner != 'none') return the_winner;
        the_winner = check_row(col);
        if (the_winner != 'none') return the_winner;
        the_winner = check_row(diag1);
        if (the_winner != 'none') return the_winner;
        the_winner = check_row(diag2);
        if (the_winner != 'none') return the_winner;
    }
    
    if (DEBUG) {
        var myStr = '';
        for (i=0;i<16;i++) {
            myStr += piece_colors[i];
            if (i%4 == 3) {
                myStr += '\n';
            } else {
                myStr += ' ';
            }
        }
        alert(myStr);
    }

    return 'none';
} //end winner()

var onDrop = function(source, target, piece, newPos, oldPos, orient) {
    if (DEBUG) $('#title').html('source: ' + source
                              + '<br>target: ' + target
                              + '<br>piece: ' + piece
                              + '<br>newPos: ' + JSON.stringify(newPos)
                              + '<br>oldPos: ' + JSON.stringify(oldPos)
                              + '<br>orient: ' + orient
                              + '<br>turn: ' + turn
                              + '<br>oldPos[target]: ' + oldPos[target]
    );

    /* reasons to not allow a move or not change whose turn it is:
        * trying to drop on a square that already has a piece on it
        * black moving on white's turn or white moving on black's turn
        * dropping a piece off board
        * trying to drop a piece on the board that already exists
    */
    if (source == 'spare' && typeof oldPos[target] !== 'undefined') return 'snapback';
    if (piece[0] != turn || JSON.stringify(newPos) == JSON.stringify(oldPos)) return 'snapback';
    for (square1 in newPos) {
        for (square2 in newPos) {
            if (newPos[square1] == newPos[square2] && square1 != square2)
                return 'snapback';
        }
    }
    if (turn == 'w') {
        turn = 'b';
    } else {
        turn = 'w';
    }
}; //end onDrop()

var onSnapEnd = function() {
    var the_winner = winner();
    if (the_winner != 'none') alert(the_winner + ' wins!');
}; //end onSnapEnd()

var init = function() {
    board = new ChessBoard('board', {
        draggable: true,
        sparePieces: true,
        showNotation: false,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    });
    turn = 'w';
}; // end init()

function run_test(test) {
    if (typeof(test) == 'function') {
        result = test();
        if (result != 'passed') {
            alert(test());
            return 0;
        }
        return 1;
    }
    return -1;
}

function run_tests() {
 
    var num_passed = 0,
        total_tests = 0,
        current_position = board.position();

    total_tests++;
    num_passed += run_test(function() {
        board.position('RBNP/4/4/4');
        if (winner() == 'white') return 'passed';
        return 'failed checking victory (white top row)';
    });

    total_tests++;
    num_passed += run_test(function() {
        board.position('r3/b3/n3/p3');
        if (winner() == 'black') return 'passed';
        return 'failed checking victory (black left column)';
    });
    
    total_tests++;
    num_passed += run_test(function() {
        board.position('P3/1N2/2B1/3R');
        if (winner() == 'white') return 'passed';
        return 'failed checking victory (white, diagonal starting at top left)';
    });

    total_tests++;
    num_passed += run_test(function() {
        board.position('3b/2p1/1n2/r3');
        if (winner() == 'black') return 'passed';
        return 'failed checking victory (black, diagonal starting at top right)';
    });

    total_tests++;
    num_passed += run_test(function() {
        board.position('4/4/4/4');
        if (winner() == 'none') return 'passed';
        return 'failed checking victory (no winner, empty board)';
    });

    alert('' + num_passed + '/' + total_tests + ' tests passed.');
}

$(document).ready(init);
