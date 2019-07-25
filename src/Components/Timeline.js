import React, { Component } from 'react';
import './../CSS/Timeline.css'
import NewsFeed from './NewsElement';
import NavBar from './NavBar';
import Loading from './Loading';

import './../../node_modules/bootstrap/dist/js/bootstrap.min.js'




class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            url: "https://newsapi.org/v2/top-headlines?country=in&apiKey=20154dc2da4d4cabbd1bcda1bc8bc69b",
            loaded: 0,
            api: "20154dc2da4d4cabbd1bcda1bc8bc69b",
            bookmarks: []
        };

    }

    //Sets  State url to the query url
    apiRef = (urlRef) => {
        this.setState({
            url: urlRef
        })
    }

    //Fetches The data from API
    fetchHandler = () => {
        fetch(this.state.url)
            .then(response => {
                return response.json();
            }).then(result => {
                console.log(result.articles)
                this.setState({
                    posts: result.articles,
                    loaded: 1,
                })
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    loaded: 2
                })
            });

    }

    //Feteches Initial Data

    componentDidMount() {
        this.fetchHandler();
    }

    //If a new api is called update the render
    componentDidUpdate(prevProps, prevState) {
        if (prevState.url !== this.state.url && this.state.url !== "") {
            console.log(this.state.url);
            this.fetchHandler();
        }
        console.log(this.state.posts);
    }

    //calls the api based on the type of request
    searchQuery = (query, type) => {
        if (type === "search") {
            this.apiRef("https://newsapi.org/v2/everything?q=" + 
            query + "&apiKey=" + this.state.api);
        }
        else if(type=== "home") {
            this.apiRef("https://newsapi.org/v2/top-headlines?country=in&apiKey=" + this.state.api);
        }
        else if(type=== "bookmarks"){
            this.setState({
                url: "",
                posts: this.state.bookmarks
            })
        }
        else {
            this.apiRef("https://newsapi.org/v2/top-headlines?country=in&category=" + 
            query + "&apiKey="+ this.state.api);
        }
    }

    updateBookmark = (value, post) => {


        if(value === false){
            let isBookmarked = false 
            for(let i=0; i< this.state.bookmarks.length; i++){
                if(this.state.bookmarks[i].url === post.url){
                    isBookmarked = true
                    break;
                }
            }
            if(!isBookmarked){
                this.setState({
                    bookmarks: this.state.bookmarks.concat(post)
                });
            }
            
        }
        else{
            let prevBookmarkList = this.state.bookmarks
            prevBookmarkList = prevBookmarkList.filter((deletePost) => {
                return deletePost.url !== post.url
            })
            console.log(prevBookmarkList);
            if(this.state.url === ""){
                this.setState({
                    posts: prevBookmarkList,
                    bookmarks: prevBookmarkList
                })
            }
            else{
                this.setState({
                    bookmarks: prevBookmarkList
                })
            }
            
        }
    }

    //Render posts for the timeline and gives appropriate messages on Errors
    renderPost = () => {

        if (this.state.posts === undefined) {
            return (<h1 class="NotLoaded">Sorry Could not Load Anything</h1>);
        }
        else if (this.state.loaded === 2) {
            return (<h1 class="NotLoaded">Internet Not Working</h1>)
        }
        else {
            const postElement = this.state.posts.map((post, index) =>{
                let bookmarked = false;
                for(let i=0; i< this.state.bookmarks.length; i++){
                    if(this.state.bookmarks[i].url === post.url){
                        bookmarked = true;
                    }
                }


                    return <NewsFeed key={index} value={post} bookmark={bookmarked}
                     updateBookmarkHandler = {this.updateBookmark}></NewsFeed>
            }
            );
            return postElement;
        }
    }


    render() {
        return (
            <>
                <NavBar queryHandler={this.searchQuery} />

                <div class="container">
                    {this.state.loaded === 0 ? <Loading /> : ""}
                </div>

                <div class="container newsFeeds">

                    {this.renderPost()}
                </div>
            </>
        )
    }

}

export default Timeline;