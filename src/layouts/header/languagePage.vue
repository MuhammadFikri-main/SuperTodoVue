<template>
    <div class="translate_wrapper " :class="{ 'active': isActive }">
        <div class="current_lang">
            <div class="lang"><i class="flag-icon" :class="this.langIcon"></i><span class="lang-txt" @click="display()">{{
                langLangauge }}</span></div>
        </div>

        <div class="more_lang" :class="{ 'active': isActive }">

            <div class="lang" v-for="(l, index) in localOptions" :key="index">
                <i class="flag-icon" :class="l.icon"></i><span class="lang-txt"
                    @click="changeLocale(l)">{{ l.name }}<span>{{ l.short }} </span></span>
            </div>
        </div>

    </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import { localeOptions } from '../../constants/config';

export default {
    name: 'languagePage',
    data() {
        return {
            isActive: false,
            localOptions: localeOptions,

        };
    },
    methods: {
        display() {
            this.isActive = !this.isActive
        },


        changeLocale(locale) {
            this.$i18n.locale = locale.id

            this.$store.dispatch('setLang', locale);

        },
    },
    computed: {
        // ...mapGetters({
        //     langIcon: 'langIcon',
        //     langLangauge: 'langLangauge'
        // })
    },
    mounted() {
        this.$store.dispatch('setLang', { id: localStorage.getItem('currentLanguage') || 'EN', icon: localStorage.getItem('currentLanguageIcon') || 'flag-icon-us' })
    }
}
</script>
