/* global describe it expect window beforeEach afterEach spyOn: true */

describe('Starting test suite for ChefSteps', function() {
  var cs;
  beforeEach(function() {
    cs = window.chefSteps;
  });

  afterEach(function() {
    cs = undefined;
  });

  it('some test', function() {
    expect(1).toBe(1);
  });

  describe('`emailGenerator` tests', function() {
    it('Invoking with 3 as parameter should return and iterator that has 3 valid input emails', function() {
      var iterator = cs.emailGenerator(3);

      expect(iterator.next()).toEqual({
        value: 'test3@test.com',
        done: false
      });
      expect(iterator.next()).toEqual({
        value: 'test2@test.com',
        done: false
      });
      expect(iterator.next()).toEqual({
        value: 'test1@test.com',
        done: false
      });
      expect(iterator.next()).toEqual({
        value: undefined,
        done: true
      });
    });

    it('Callingiterator more times than passed in initial parameter should return undefined and done true', function() {
      var iterator = cs.emailGenerator(1);

      expect(iterator.next()).toEqual({
        value: 'test1@test.com',
        done: false
      });
      expect(iterator.next()).toEqual({
        value: undefined,
        done: true
      });
    });

    it('Calling with out any parameter should return iterator with undefined and done true', function() {
      var iterator = cs.emailGenerator();
      expect(iterator.next()).toEqual({
        value: undefined,
        done: true
      });
    });
  });

  describe('`shuffle function test`', function() {
    it('Passed in a list items should be randomly shuffled and returned back', function() {
      var list1 = ['test1@test.com', 'test2@test.com', 'test3@test.com', 'test4@test.com'];
      var list2 = cs.shuffle(list1);

      expect(list1.toString()).not.toEqual(list2.toString());
    });

    it('Passing in a number to shuffle should throw and error and exit', function() {
      try {
        cs.shuffle(2);
      } catch (e) {
        expect(e.message).toEqual('Invalid input to shuffle');
      }
    });
    it('Passing in an object to shuffle should throw and error and exit', function() {
      try {
        cs.shuffle({});
      } catch (e) {
        expect(e.message).toEqual('Invalid input to shuffle');
      }
    });
    it('Calling shuffle with no argument should throw and error and exit', function() {
      try {
        cs.shuffle();
      } catch (e) {
        expect(e.message).toEqual('Invalid input to shuffle');
      }
    });
  });

  describe('`uniqueEmails` tests', function() {
    it('Anything other than a list is passed, should throw an error', function() {
      try {
        cs.uniqueEmails();
      } catch (e) {
        expect(e.message).toEqual('Invalid input passed. Expects a list to be passed');
      }

      try {
        cs.uniqueEmails(3);
      } catch (e) {
        expect(e.message).toEqual('Invalid input passed. Expects a list to be passed');
      }

      try {
        cs.uniqueEmails({});
      } catch (e) {
        expect(e.message).toEqual('Invalid input passed. Expects a list to be passed');
      }
    });

    it('Passing list with duplicates values as input should return a new list with only unique value back', function() {
      var list1;
      var list2;

      list1 = [
        'test1@test.com',
        'test2@test.com',
        'test4@test.com',
        'test4@test.com',
        'test3@test.com',
        'test1@test.com',
        'test3@test.com'
      ];

      expect(list1.length).toBe(7);
      list2 = cs.uniqueEmails(list1);
      expect(list1.length).toBeGreaterThan(list2.length);
      expect(list2.length).toBe(4);

      list1 = [
        'test1@test.com',
        'test1@test.com',
        'test1@test.com',
        'test1@test.com',
        'test1@test.com'
      ];

      expect(list1.length).toBe(5);
      list2 = cs.uniqueEmails(list1);
      expect(list1.length).toBeGreaterThan(list2.length);
      expect(list2.length).toBe(1);
    });

    it('Passing in non duplicate value list should return same length list back', function() {
      var list1;
      var list2;

      list1 = [
        'test1@test.com',
        'test2@test.com',
        'test3@test.com',
        'test4@test.com'
      ];

      expect(list1.length).toBe(4);
      list2 = cs.uniqueEmails(list1);
      expect(list2.length).toBe(4);
    });

    it('The order output should be maintained while filtering out duplicates', function() {
      var list1;
      var list2;

      list1 = [
        'test1@test.com',
        'test2@test.com',
        'test3@test.com',
        'test4@test.com'
      ];

      list2 = cs.uniqueEmails(list1);
      expect(list1[0]).toEqual(list2[0]);
      expect(list1[3]).toEqual(list2[3]);

      list1 = [
        'test1@test.com',
        'test4@test.com',
        'test1@test.com',
        'test5@test.com',
        'test3@test.com'
      ];

      expect(list1.length).toBe(5);
      list2 = cs.uniqueEmails(list1);
      expect(list2.length).toBe(4);
      expect(list2[0]).toEqual('test1@test.com');
      expect(list2[2]).toEqual('test5@test.com');
      expect(list2[3]).toEqual('test3@test.com');
    });
  });

  describe('`getInputList` tests', function() {
    it('Should always return a list of 100000 emails', function() {
      expect(cs.getInputList(20).length).toBe(100000);
      expect(cs.getInputList(1000).length).toBe(100000);
      expect(cs.getInputList().length).toBe(100000);
    });
    // Need more tests for all branches
  });

  describe('`init` tests', function() {
    it('Invoking init function should return an object', function() {
      var timer = cs.init(20);
      expect(Object.prototype.toString.call(timer)).toEqual('[object Object]');
      expect(timer.startTime).toBeDefined();
      expect(timer.endTime).toBeDefined();
      expect(timer.startTime < timer.endTime).toBe(true);

      timer = cs.init(2000);
      expect(timer.startTime < timer.endTime).toBe(true);

      timer = cs.init(20000);
      expect(timer.startTime < timer.endTime).toBe(true);
    });
  });

  describe('To show the time taken to filter out unique emails for', function() {
    it('Input list of size 100000 is less than a sec', function() {
      var timer = cs.init(20);
      expect((timer.endTime - timer.startTime) / 1000).toBeLessThan(1);

      timer = cs.init(2000);
      expect((timer.endTime - timer.startTime) / 1000).toBeLessThan(1);

      timer = cs.init();
      expect((timer.endTime - timer.startTime) / 1000).toBeLessThan(1);
    });
  });
});
