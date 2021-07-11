import { gql } from '@apollo/client';

const CREATE_COMMENT = gql`
	mutation createComment($postId: ID!, $parentId: ID, $body: String!, $level: Int!) {
		createComment(postId: $postId, parentId: $parentId, body: $body, level: $level) {
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

const DELETE_COMMENT = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
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

const UPVOTE_COMMENT = gql`
	mutation upvoteComment($postId: ID!, $commentId: ID!) {
		upvoteComment(postId: $postId, commentId: $commentId) {
			id
			createdAt
			username
			body
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

const DOWNVOTE_COMMENT = gql`
	mutation downvoteComment($postId: ID!, $commentId: ID!) {
		downvoteComment(postId: $postId, commentId: $commentId) {
			id
			createdAt
			username
			body
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

export { CREATE_COMMENT, DELETE_COMMENT, UPVOTE_COMMENT, DOWNVOTE_COMMENT };
