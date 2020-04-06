class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    console.log(`${name} is now a friend!`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('Friend not found');
    }

    this.friends.splice(idx, 1);
  }
}

describe('FriendsList', () => {
  let friendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('should initializes friends list', () => {
    expect(friendsList.friends).toHaveLength(0);
  });

  it('should adds a friend to the list', () => {
    friendsList.addFriend('Rafael');

    expect(friendsList.friends).toHaveLength(1);
  });

  it('should announces friendship', () => {
    friendsList.announceFriendship = jest.fn(); // mock function

    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Rafael');

    expect(friendsList.announceFriendship).toHaveBeenCalled();
  });

  describe('removeFriend', () => {
    it('should remove friend from the list', () => {
      friendsList.addFriend('Rafael');
      expect(friendsList.friends[0]).toEqual('Rafael');

      friendsList.removeFriend('Rafael');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('should throws an error as friend does not exist', () => {
      expect(() => friendsList.removeFriend('Rafael')).toThrowError();
    });
  });
});
