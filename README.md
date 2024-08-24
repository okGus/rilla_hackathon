<!-- ABOUT THE PROJECT -->
## About the Project
[![Rilla Voice Hackathon][hackathon-screenshot]](http://18.208.201.52:3000/)

This feature directly supports Rilla's goal of providing actionable, data-driven feedback by enabling detailed annotation and summarization of sales interactions, improving coaching and decision-making.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap the project.

* [![Next][Next.js]][Next-url]
* [![Mui][Mui.com]][Mui-url]
* [![Clerk][Clerk.com]][Clerk-url]
* [![Aws][Aws.com]][Aws-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

_Below is an example of how you can get started on installing and setting up the app._

1. Clone the repo
```sh
git clone https://github.com/okGus/rilla_hackathon.git
```
2. Install NPM packages
```sh
npm install
```
3. Create table at https://console.aws.amazon.com/dynamodb/
```text
Partition key - 'PK'
Sort key - 'SK'
```
4. Create IAM user with roles to access DynamoDB at https://console.aws.amazon.com/iam/
5. Create an account at https://clerk.com/
6. Enter your keys in `.env`
```text
AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
AWS_REGION=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

<!-- CONTRIBUTING -->
## Contributers
<a href="https://github.com/okGus/rilla_hackathon/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=okGus/rilla_hackathon" alt="contrib.rocks image" />
</a>

<!-- MARKDOWN LINKS & IMAGES -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/

[Mui.com]: https://img.shields.io/badge/Mui-0769AD?style=for-the-badge&logo=mui&logoColor=white
[Mui-url]:https://mui.com/

[Clerk.com]: https://img.shields.io/badge/Clerk-000000?style=for-the-badge&logo=clerk&logoColor=white
[Clerk-url]: https://clerk.com/

[Aws.com]: https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+DynamoDB&color=4053D6&logo=Amazon+DynamoDB&logoColor=FFFFFF&label=
[Aws-url]: https://console.aws.amazon.com/dynamodb/