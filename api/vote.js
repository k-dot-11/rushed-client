import { gql, useMutation } from '@apollo/client';

const UPVOTE_POST = gql`
	mutation upvotePost($postId: ID!) {
		upvotePost(postId: $postId) {
			id
			title
			body
			username
			upvotes {
				username
				createdAt
			}
			downvotes {
				username
				createdAt
			}
			score
		}
	}
`;

const DOWNVOTE_POST = gql`
	mutation downvotePost($postId: ID!) {
		downvotePost(postId: $postId) {
			id
			title
			body
			username
			upvotes {
				username
				createdAt
			}
			downvotes {
				username
				createdAt
			}
			score
		}
	}
`;



export { UPVOTE_POST, DOWNVOTE_POST };
