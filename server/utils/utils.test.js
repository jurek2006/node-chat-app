const expect = require('expect');
const {Users} = require('./users.js');

describe('Users', () => {
    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        },{
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }]
    });
    
    it('should add new user', () => {
        const users = new Users();
        const user = {
            id: '123', 
            name: 'Jurek',
            room: 'Office'
        };
        const resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
        expect(resUser).toEqual(user);
    });

    it('should remove a user', () => {
        const idToDelete = '2';
        const user = users.removeUser(idToDelete);
        expect(users.users.length).toBe(2);
        expect(users.users.filter(user => user.id === idToDelete).length).toBe(0);
        expect(user).toMatchObject({
            id: '2',
            name: 'Jen',
            room: 'React Course'
        });
    });

    it('should not remove user', () => {
        const idToDelete = '20000';
        const user = users.removeUser(idToDelete);
        expect(users.users.length).toBe(3);
        expect(users.users.filter(user => user.id === idToDelete).length).toBe(0);
        expect(user).toBeUndefined();
    });
    
    it('should find user', () => {
        const idToFind = '2';
        const foundUser = users.getUser(idToFind);
        expect(foundUser).toBeTruthy();
        expect(foundUser).toMatchObject({
            id: '2',
            name: 'Jen',
            room: 'React Course'
        });
    });
    
    it('should not find user', () => {
        const idToFind = '2000';
        const foundUser = users.getUser(idToFind);
        expect(foundUser).toBeUndefined();
    });

    it('should return names for node course', () => {
        const userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        const userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });
});