# my-blog
React / Express / MongoDB / AWS

AWS 

1. Create EC2 instance
2. [Install Node](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)
    1. Install all of the node modules `npm install`
    2. Install the `forever` package which will manage the running server so we don't have to execute it from the CLI
        1. `npm install -g forever`
3. [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/)
    1. Make sure mongoDB is running `sudo service mongod start`
    2. Add articles

    ```bash
    mongo
    use my-blog
    db.articles.insert([{ name: 'learn-react', upvotes: 0, comments: [], }, { name: 'learn-node', upvotes: 0, comments: [], }, { name: 'my-thoughts-on-resumes', upvotes: 0, comments: [], }])
    ```
    
    Response
    
    ```bash
    > use my-blog
    switched to db my-blog
    > db.articles.insert([{ name: 'learn-react', upvotes: 0, comments: [], }, { name: 'learn-node', upvotes: 0, comments: [], }, { name: 'my-thoughts-on-resumes', upvotes: 0, comments: [], }])
    BulkWriteResult({
            "writeErrors" : [ ],
            "writeConcernErrors" : [ ],
            "nInserted" : 3,
            "nUpserted" : 0,
            "nMatched" : 0,
            "nModified" : 0,
            "nRemoved" : 0,
            "upserted" : [ ]
    })
    ```

4. Install git and clone this repo

    ```bash
    sudo yum install git -y
    git clone https://github.com/billybackpack25/my-blog.git
    ```

5. From the my-blog directory run the server

```bash
forever start -c "npm start" .
forever list # Show it's working
```

6. Open up PORT 80 from the AWS EC2 instance to 8005 of the server
```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8005
```

7. AWS security group to allow the port
    1. Add the HTTP protocal to your IP address > Save

COMPLETED

load up your EC2 IPv4 DNS address in the browser
