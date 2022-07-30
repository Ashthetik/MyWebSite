// Create route components:
const Home = {
    template: `
    <script>
        $(window).scroll(function(event) {
            function projectsBar() {
                var scroll = $(window).scrollTop();
                if (scroll > 2200 && scroll < 2800) {
                    $(".skills_projects_link").fadeIn("slow").addClass("show");
                } else {
                    $(".skills_projects_link").fadeOut("slow").removeClass("show");
                }
            }
            projectsBar();
        });
    </script>
    <main id='home'>
        <div class="about__me">
            <img class="avatar" src="/img/avatar-2-modified.svg" alt="user avatar"></img>
            <h1>Phoenix Reid</h1><br>
            <h3>Full Stack Web Developer<br>Jnr. C++, JS, and Python Developer<br>Network Engineer</h3><br>
            <p>Hi there! 👋<br>I'm an, 18-year-old, aspiring-developer!<br>I've studied with RMIT (Melbourne/Australia) to gain the upper hand in understanding networking, followed by my current studies in Cyber Security with the University of Tasmania.
            <br><br>I'm currently looking for a job as a junior web developer, or a junior C++ developer, or a junior network engineer.
            <br><br>One of my most favourable projects, and most up to date, is <a href="https://scarletai.xyz" target="_blank">Scarlet</a>. An open source AI that uses very basic Natural Language Processing (NLP) and third-party anti-virus APIs to help protect users from potential phishing links, viruses and more!
            <br><br>Another project that took a Red Team stand point is <a href="https://github.com/KazutoKashima/Project-Key-Breaker" target="_blank">Key Breaker</a> it can be used to retrieve, decipher, and exploit the weak security standards of Chrome's password manager.</p>
            <br><br><div class="skills_projects_link">
                <router-link to="/projects"> Projects | Skills </router-link>
            </div>
            
        <footer>
            <p>© 2022 - Developed by <a href="https://github.com/KazutoKashima">Phoenix Reid</a>, with ❤️ and VueJS.</p>
        </footer>
        </div>
    </main>
    
`
};

const Projects = {
    template: `
        <div>
            
        <header id="site_header" class="container d_flex">
            <div class="bio__media">
                <img src="/img/avatar-2-modified.svg" alt="user avatar">
                <div class="bio__media__text">
                    <h1>Phoenix Reid</h1>
                    <h3>Full Stack Web Developer<br>Jnr. C++, JS, and Python Developer<br>Network Engineer</h3>
                    <p>Here's a <i>"short"</i> list of my GitHub repos!</p>
                </div>
            </div> 
            <nav>
                <router-link to="/" class="p_2">Home</router-link>
                <router-link to="/projects" class="p_2">Projects</router-link>
                <a :href="gitHubLink" target="_blank">
                    <i class="fab fa-github fa-lg fa-fw"></i>
                </a>
            </nav>
        </header>
        
        <main class="container">
        
            <!-- Show an error message if the REST API doesn't work -->
            <div class="error" v-if="errors">
                Sorry! It seems we can't fetch data righ now 😥
            </div>
            <!-- Otherwise show a section for our portfolio projects and skills section-->
            <section id="portfolio" v-else>
                <!-- loading message -->
                <div class="loading" v-if="loading">
                    <img src="/img/loading.svg" style="max-height: 5%; max-width:5%;" alt="loading..."> Loading ...
                </div>
                
                <!-- show the projects -->
                <div class="projects" v-else>
                
                    <div v-for="project in projectsList" class="card__custom" >
                        <div class="card__custom__text"> 
                            <div> 
                                <h3>{{trimTitle(project.name)}}</h3>
                                <p>{{trimText(project.description)}}</p>
                            </div>

                            <div class="meta__data d_flex">
                                <div class="date">
                                    <h5>Update at</h5>
                                    <div> {{ new Date(project.updated_at).toDateString()}}</div>
                                </div>
                                <!--<img :src="project.owner.avatar_url">-->
                            </div>
                        </div>
                        

                        <div class="card__custom__img"></div>
                        <div class="card_custom__button">
                            <a :href="project.html_url" target="_blank">
                                Code
                            </a>
                        </div>
                    
                    </div>

                    <div v-if="!loading" style="text-align:center; width: 100%" >
                        <div v-if="projectsList.length < projects.length"> 
                            <button class="btn_load_more" v-on:click="loadMore()">Load More</button>
                        </div>
                        <div v-else>
                            <a :href="gitHubLink" target="_blank">Visit My GitHub</a>
                        </div>

                    </div>
                    
                    <div id="skills_section">
                        <h2>Development Skills</h2>
                        <ul class="skills"> 
                            <li v-for="skill in skills">{{skill}}</li>
                        </ul>
                    </div>

                </div>

                

            </section>
        
        </main>

    </div>
    `,
    data() { 
        return {
            projects: [],
            projectsList: null,
            skills: ["C#", "Python", "JavaScript", "C(++)"],
            projectsCount: 5,
            perPage: 20,
            loading : true,
            errors: false,
            gitHubLink: 'https://github.com/KazutoKashima'
            }
    },
    methods:{
        fetchData: function () {
            axios.get(`https://api.github.com/users/ScarletAIO/repos?per_page=${this.perPage}`)
                .then(response => { 
                    console.log(response);
                    this.projects = response.data;
                    this.projects.forEach( project => {
                        if(project.language !== null && !this.skills.includes(project.language)) {
                            this.skills.push(project.language)
                        }
                    })

                })
                .catch(error => { 
                    console.log(error);
                    this.errors = true;
            }).finally( ()=> {
                this.loading = false;
                this.getProjects();
            })
        }, 
        getProjects(){
            this.projectsList = this.projects.slice(0, this.projectsCount);
            return this.projectsList;
        },
        loadMore(){
            if(this.projectsList.length <= this.projects.length ) {
                this.projectsCount += 5;
                this.getProjects();
                // this.projectsList = this.projects.slice(0, this.projectsCount);
            }
        },
        trimTitle(text){
            const title = text.replaceAll("-", " ").replaceAll("_", " ");
            if(title.length > 15) {
                return title.slice(0, 12) + ' ...';
            } 
            return title
        },
        trimText(text){
            
            if(text === null) {
                return 'This project has no description yet!'
            } else if(text.length > 100) {
                 return text.slice(0, 100) + ' ...'
            } 
            return text;
        }
    },
    mounted(){
      //this.fetchData();  
      setTimeout(this.fetchData, 2000);
    }
}

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/projects',
        component: Projects
    }
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router,
    data: {
        title: 'Phoenix Reid'
    }
}).$mount("#app");