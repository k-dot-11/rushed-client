import { gql } from '@apollo/client';

export const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			title
			body
			createdAt
			username
			score
			commentCount
			comments {
				id
				body
				score
				username
				upvotes{
					username
				}
				downvotes{
					username
				}
			}
			upvotes {
				username
			}
			downvotes {
				username
			}
		}
	}
`;
