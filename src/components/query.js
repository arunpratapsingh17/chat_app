export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      imageUri
      status
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
          chatRoom{
              id
              chatRoomUsers{
                  items{
                      user{
                        id
                        name
                        imageUri
                        status
                      }
                  }
              }
              group
              groupName
          }
          
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;