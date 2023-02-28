import React, { useState, useEffect } from 'react';

import axios from 'axios';

const client = axios.create({
	baseURL: 'https://url-service-0ds1.onrender.com/items',
});

const App = () => {
	const [target, setTarget] = useState('');
	const [iframe, setIframe] = useState('');
	const [disable, setDisable] = useState(false);
	const [items, setItems] = useState([]);

	// GET with Axios
	useEffect(() => {
		const fetchItems = async () => {
			try {
				let response = await client.get('?_limit=10');
				setItems(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchItems();
	}, []);

	// DELETE with Axios
	const deleteItem = async (id) => {
		try {
			await client.delete(`${id}`);
			setItems(
				items.filter((item) => {
					return item.id !== id;
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	// handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		addItems(target, iframe, disable);
	};

	// POST with Axios
	const addItems = async (target, iframe, disable) => {
		try {
			let response = await client.post('', {
				target_url: target,
				iframe_url: iframe,
				disable: disable
			});
			setItems([response.data, ...items]);
			setTarget('');
			setIframe('');
			setDisable(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="app">
			<nav>
				<h1>URLS IFRAME APP</h1>
			</nav>
			<div className="add-post-container">
				<form onSubmit={handleSubmit}>
					<input
						type="url"
						className="form-control"
						value={target}
						onChange={(e) => setTarget(e.target.value)}
					/>
					<input
						type="text"
						className="form-control"
						value={iframe}
						onChange={(e) => setIframe(e.target.value)}
					/>
					<input
						type="checkbox"
						className="form-control"
						value={disable}
						onChange={(e) => setDisable(!disable)}
					/>
					<button type="submit">Add Iframe</button>
				</form>
			</div>
			<div className="posts-container">
				<h2>All Urls</h2>
				{items.map((item) => {
					return (
						<div className="post-card" key={item.id}>
							<h2 className="post-title">{item.target_url}</h2>
							<p className="post-body">{item.iframe_url}</p>
							<p className="post-body">Running: {item.disable === true ? 'No': 'Yes'}</p>
							<div className="button">
								<div className="delete-btn" onClick={() => deleteItem(item.id)}>
									Delete
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default App;
