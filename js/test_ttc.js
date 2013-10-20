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


