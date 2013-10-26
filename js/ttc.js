var DEBUG = false,
    board,
    turn,
    turn_number,
    pawn_dir = []
    turn_to_int = {'w':1,'b':-1},
    ai = true,
    ai_color = 'b';

function getRandomElement(array) { return (typeof(array) !== 'undefined' && array.length > 0) ? array[Math.floor(Math.random()*array.length)] : undefined; }

function piece_color(piece) {
    if ('RNBP'.indexOf(piece) != -1) return 'w';
    if ('rnbp'.indexOf(piece) != -1) return 'b';
    return 'invalid';
} //end piece_color(piece)

function fenToPieceCode(piece) {
    if (piece.toLowerCase() === piece) {
        return 'b' + piece.toUpperCase();
    }
    return 'w' + piece.toUpperCase();
} //end fenToPieceCode(piece)

function pieceCodeToFen(piece) {
    var tmp = piece.split('');
    if (tmp.length != 2) return 'invalid';
    if (tmp[0] === 'w') {
        return tmp[1].toUpperCase();
    }
    return tmp[1].toLowerCase();
} //end pieceCodeToFen(piece)

function used_pieces(color) {
    var used = '',
        position = board.fen();
    if (typeof(color) === 'undefined') color = 'wb';
    for (var i=0; i<position.length; i++) {
        if (color.indexOf(piece_color(position[i])) != -1)
            used = used.concat(position[i]);
    }
    return used;
}

function unused_pieces(color) {
    var used = used_pieces(),
        unused = '',
        all = (color == 'w') ? 'RNBP' : (color == 'b') ? 'rnbp' : 'RNBPrnbp';
    for (var i=0; i<all.length; i++) {
        if (used.indexOf(all[i]) == -1)
            unused = unused.concat(all[i]);
    }
    return unused;
}

function hide_show_used_pieces() {
    var spare_pieces = $('.piece-417db'),
        used = used_pieces(),
        unused = unused_pieces();
    for (var i=0; i<spare_pieces.length; i++) {
        var piece = pieceCodeToFen(spare_pieces[i].id.substr(0,2));
        if (piece != 'invalid') {
            if (used.indexOf(piece) != -1) {
                $(spare_pieces[i]).hide();
            } else if (unused.indexOf(piece) != -1) {
                $(spare_pieces[i]).show();
            }
        }
    }
}

function winner(position_to_check) {
    if (typeof(position_to_check) === 'undefined') position_to_check = board.fen();
    var i = 0, j, k,
        cur = '',
        cur_num = 0,
        the_winner = 'none',
        piece_colors = [],
        col = [], diag1 = [], diag2 = [],
        position = position_to_check.split('/');

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
    
    return 'none';
} //end winner()

function drop_piece(piece, target) {
    var position = board.position();
    if (piece_color(piece) == 'invalid' || typeof(position[target]) !== 'undefined') return false;
    position[target] = fenToPieceCode(piece);
    board.position(position);
    return true;
}

function ai_move() {
    var unused = unused_pieces(ai_color);
    if (unused.length > 0) {
       while (!drop_piece(getRandomElement(unused), getRandomElement('abcd') + getRandomElement('1234')));
    } else {

    }
    turn = (turn == 'w') ? 'b' : 'w';
    turn_num++;
    hide_show_used_pieces();
}

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
        * moving a piece before 3 pieces have been placed intially
        * trying to drop a piece on the board that already exists
    */
    if (source == 'spare' && typeof oldPos[target] !== 'undefined' ||
        piece[0] != turn ||
        JSON.stringify(newPos) == JSON.stringify(oldPos) ||
        source != 'spare' && turn_num < 6) {
        return 'snapback';
    }

    for (square1 in newPos) {
        if (typeof oldPos[square1] !== 'undefined' && newPos[square1][0] == oldPos[square1][0] && newPos[square1][1] != oldPos[square1][1]) return 'snapback';
        for (square2 in newPos) {
            if (newPos[square1] == newPos[square2] && square1 != square2) return 'snapback';
        }
    }

    function letter_to_num(letter) {
        switch(letter) {
            case 'a':
                return 1;
            case 'b':
                return 2;
            case 'c':
                return 3;
            case 'd':
                return 4;
            default:
                return -1;
        }
    }

    function num_to_letter(num) {
        switch (num) {
            case 1:
                return 'a';
            case 2:
                return 'b';
            case 3:
                return 'c';
            case 4:
                return 'd';
            default:
                return 'X';
        }
    }

    function generate_path(start, end) {
        var dir1, dir2, cur1, cur2, dest1, dest2,
            path = [];
        cur1 = letter_to_num(start[0]);
        cur2 = parseInt(start[1]);
        dest1 = letter_to_num(end[0]);
        dest2 = parseInt(end[1]);
        dir1 = (dest1 > cur1) ? 1 : (dest1 < cur1) ? -1 : 0;
        dir2 = (dest2 > cur2) ? 1 : (dest2 < cur2) ? -1 : 0;
        while ( (cur1 != dest1 || cur2 != dest2) && path.length <= 4 ) {
            cur1 += dir1; cur2 += dir2;
            if (cur1 != dest1 || cur2 != dest2) {
                path.push(num_to_letter(cur1) + cur2);
            }
        }
        return (path.length >= 4) ? [] : path;
    }

    if (source != 'spare') {
        switch(piece[1]) {
        case 'R':
            if (source[0] != target[0] && source[1] != target[1]) return 'snapback';
            path_to_check = generate_path(source, target);
            for (var i=0; i<path_to_check.length; i++) {
                if (typeof(oldPos[path_to_check[i]]) !== 'undefined') return 'snapback';
            }
            break;
        case 'B':
            if (Math.abs(letter_to_num(source[0]) - letter_to_num(target[0])) != Math.abs(parseInt(source[1]) - parseInt(target[1]))) return 'snapback';
            path_to_check = generate_path(source, target);
            for (var i=0; i<path_to_check.length; i++) {
                if (typeof(oldPos[path_to_check[i]]) !== 'undefined') return 'snapback';
            }
            break;
        case 'N':
            var dx = Math.abs(letter_to_num(source[0]) - letter_to_num(target[0])),
                dy = Math.abs(parseInt(source[1]) - parseInt(target[1]));
            if (!((dx == 2 && dy == 1) || (dx == 1 && dy == 2))) return 'snapback';
            break;
        case 'P':
            var dx = Math.abs(letter_to_num(source[0]) - letter_to_num(target[0])),
                valid = false;

            if (parseInt(source[1]) + pawn_dir[piece[0]] == parseInt(target[1])) valid = true;
            if (dx == 1 && typeof(oldPos[target]) === 'undefined') valid = false;
            if (dx == 0 && typeof(oldPos[target]) !== 'undefined') valid = false;
            if (dx > 1) valid = false;

            if (!valid) return 'snapback';
            if (target[1] == '1' || target[1] == '4') pawn_dir[piece[0]] = -pawn_dir[piece[0]];
            break;
        default:
            break;
        } //end switch(piece[1])
        if (typeof(oldPos[target]) !== 'undefined') {
            var piece_images = $('.piece-417db');
            for (i=0; i<piece_images.length; i++) {
                if (piece_images[i].id.indexOf(oldPos[target]) == 0)
                    $(piece_images[i]).show();
            }
        }
    } else { //if placing a spare piece
        if (piece[1] == 'P') {
            if (piece[0] == 'w') {
                pawn_dir['w'] = 1;
                if (target[1] == '4')
                    pawn_dir['w'] = -1;
            } else {
                pawn_dir['b'] = -1;
                if (target[1] == '1')
                    pawn_dir['b'] = 1;
            }
        }
        var piece_images = $('.piece-417db');
        for (i=0; i<piece_images.length; i++) {
            if (piece_images[i].id.indexOf(piece) == 0)
                $(piece_images[i]).hide();
        }
    }

    turn = (turn == 'w') ? 'b' : 'w';
    turn_num++;
}; //end onDrop()

var onDragStart = function(source, piece, position, orientation) {
  if (winner() != 'none') {
    return false;
  }
};

var onSnapEnd = function() {
    var the_winner = winner();
    the_winner = (the_winner == 'w') ? 'White' : (the_winner == 'b') ? 'Black' : the_winner;
    if (the_winner != 'none') alert(the_winner + ' wins!');
    if (ai && ai_color == turn) ai_move();
}; //end onSnapEnd()

var init = function() {
    board = new ChessBoard('board', {
        draggable: true,
        sparePieces: true,
        onDrop: onDrop,
        onDragStart: onDragStart,
        onSnapEnd: onSnapEnd
    })
    
    $('#restart').click(function() {
        board.position('4/4/4/4');
        turn = 'w';
        turn_num = 0;
        pawn_dir['w'] = 1;
        pawn_dir['b'] = -1;
        hide_show_used_pieces();
    });
    $('#restart').click();

    $('#flipboard').click(function(){
        board.flip();
        hide_show_used_pieces();
    });
    if (ai && ai_color == turn) ai_move();
}; // end init()

$(document).ready(init);
