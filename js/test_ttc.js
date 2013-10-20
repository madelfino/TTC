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
        current_position = JSON.parse(JSON.stringify((board.position())));

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

    total_tests++;
    num_passed += run_test(function() {
        if (onDrop('spare', 'a1', 'wP', {'a1':'wP'}, {}) != 'snapback') return 'passed';
        return 'failed droping piece on board (white pawn on a1)';
    });

    total_tests++;
    num_passed += run_test(function() {
        if (onDrop('a1', 'd4', 'wP', {'d4':'wP'}, {'a1':'wP'}) == 'snapback') return 'passed';
        return 'failed allowed white to move twice in a row';
    });

    total_tests++;
    num_passed += run_test(function() {
        if (onDrop('spare', 'd4', 'bR', {'a1':'wP','d4':'bR'}, {'a1':'wP'}) != 'snapback') return 'passed';
        return 'failed dropping piece on board (black rook on d4)';
    });

    total_tests++;
    num_passed += run_test(function() {
        if (onDrop('spare', 'd4', 'wN', {'a1':'wP', 'd4':'wN'}, {'a1':'wP','d4':'bR'}) == 'snapback') return 'passed';
        return 'failed allowed a drop-capture';
    });

    total_tests++;
    num_passed += run_test(function() {
        if (onDrop('spare', 'a2', 'wP', {'a1':'wP','a2':'wP','d4':'bR'}, {'a1':'wP','d4':'bR'}) == 'snapback') return 'passed';
        return 'failed allowed dropping a piece that is already on the board';
    });

    board.position('4/4/4/4');
    turn_num = 0;
    turn = 'w';
    alert('' + num_passed + '/' + total_tests + ' tests passed.');
}


