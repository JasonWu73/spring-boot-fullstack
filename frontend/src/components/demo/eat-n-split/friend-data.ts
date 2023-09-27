const initialFriends = [
  {
    id: 1,
    name: 'Lisa',
    image: 'https://i.pravatar.cc/150?img=40',
    balance: -10.5,
    creditRating: 5
  },
  {
    id: 2,
    name: 'Lucy',
    image: 'https://i.pravatar.cc/400?img=29',
    balance: 8.8,
    creditRating: 3.5
  },
  {
    id: 3,
    name: 'Lily',
    image: 'https://i.pravatar.cc/400?img=24',
    balance: 0,
    creditRating: 0
  },
  {
    id: 4,
    name: 'Super long long long long longlong long long long long  long long long long long long long long long long long long name',
    image: 'https://i.pravatar.cc/400?img=23',
    balance: 0,
    creditRating: 0
  },
  {
    id: 5,
    name: 'Bartholomew',
    image: 'https://i.pravatar.cc/400?img=22',
    balance: 0,
    creditRating: 0
  },
  {
    id: 6,
    name: 'Lola',
    image: 'https://i.pravatar.cc/400?img=21',
    balance: 0,
    creditRating: 0
  },
  {
    id: 7,
    name: 'Lara',
    image: 'https://i.pravatar.cc/400?img=20',
    balance: 0,
    creditRating: 0
  }
]

type Friend = (typeof initialFriends)[0]

export { initialFriends, type Friend }
