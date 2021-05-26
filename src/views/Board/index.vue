<template>
    <AppLayout>
        <div class="container">
            <div class="team-container">
                <div class="board-name">{{board.name}}</div>
                <div class="member"
                     :title="member.first_name + ' ' + member.last_name" v-for="member in board.members"
                     :key="member.id"
                     @click="openRemoveForm(member)"
                >
                    {{member.initial}}
                </div>
                <a v-if="isRemoveMemberInputActive" @click="handleRemoveMember" class="button">
                    Delete {{memberData.fullName}}
                </a>
                <a v-if="isRemoveMemberInputActive" @click="isRemoveMemberInputActive = false" class="button">Cancel</a>
                <a v-else @click.prevent="isAddMemberInputActive = true" class="button">
                    <input
                            v-if="isAddMemberInputActive"
                            v-model="memberData.username"
                            @keydown.enter="handleAddMember"
                            type="text"
                            placeholder="Username" autofocus>
                    <span v-else>+ Add member</span>
                </a>
            </div>
            <div class="card-container">
                <div class="content" :class="{'card-on-edit': isCardOnEdit}">
                    <div class="list" v-for="list in board.lists" :key="list.id">
                        <header @click.self="handleMoveCardToList(list)">
                            <input
                                    v-if="list.isEditListInputActive"
                                    @keypress.enter="handleEditOrDeleteList(list, $event.target.value)"
                                    :value="list.name"
                                    type="text"
                                    placeholder="Are you sure want to delete?" autofocus>
                            <span v-else @click="list.isEditListInputActive = true">{{list.name}}</span>
                        </header>
                        <div class="cards">
                            <div class="card" v-for="card in list.cards" :key="card.card_id">
                                <div class="card-content" @click="handleClickCard(card)">
                                    <input
                                            v-if="card.isEditCardInputActive"
                                            @keydown.enter="handleUpdateOrDeleteCard(list, card, $event.target.value)"
                                            :value="card.task"
                                            type="text"
                                            placeholder="Are you sure want to delete?" autofocus>
                                    <span v-else>{{card.task}}</span>
                                </div>
                                <div class="control">
                                    <span @click="handleMoveCardToUp(card)">&uarr;</span>
                                    <span @click="handleMoveCardToDown(card)">&darr;</span>
                                </div>
                            </div>
                        </div>
                        <div class="button" @click="list.isAddCardInputActive = true">
                            <input
                                    v-if="list.isAddCardInputActive"
                                    v-model="cardData.task"
                                    @keydown.enter="handleStoreCard(list)"
                                    type="text"
                                    placeholder="New card" autofocus>
                            <span v-else>+ Add new card</span>
                        </div>
                        <div class="control">
                            <span @click="handleMoveListToLeft(list)">&larr;</span>
                            <span @click="handleMoveListToRight(list)">&rarr;</span>
                        </div>
                    </div>
                    <div class="list button" @click="isAddListInputActive = true">
                        <input
                                v-if="isAddListInputActive"
                                v-model="listData.name"
                                @keydown.enter="handleStoreList"
                                type="text"
                                placeholder="New List Name"
                                autofocus>
                        <span v-else>+ Add another list</span>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
    import AppLayout from "../../components/Layouts/AppLayout";
    import ApiService from '../../helpers/ApiService';

    export default {
        name: "index",
        components: {AppLayout},
        async mounted() {
            await this.fetchBoardDetail();
        },
        data() {
            return {
                board: {},
                isAddMemberInputActive: false,
                isRemoveMemberInputActive: false,
                isAddListInputActive: false,
                memberData: {
                    id: '',
                    fullName: '',
                    username: '',
                },
                listData: {
                    name: '',
                },
                cardData: {
                    id: '',
                    task: '',
                },
                isCardOnEdit: false,
            };
        },
        methods: {
            async fetchBoardDetail() {
                const res = await ApiService.get(`board/${this.$route.params.id}`);
                const data = await res.json();

                data.lists.forEach(list => {
                    list.isEditListInputActive = false;
                    list.isAddCardInputActive = false;

                    list.cards.forEach(card => {
                        card.isEditCardInputActive = false;
                    });
                });

                this.board = data;
            },
            async handleAddMember() {
                const res = await ApiService.post(`board/${this.$route.params.id}/member`, this.memberData);

                if (res.status === 200) {
                    this.isAddMemberInputActive = false;
                    this.memberData.username = '';

                    await this.fetchBoardDetail();
                }
            },
            openRemoveForm(member) {
                this.memberData.id = member.id;
                this.memberData.fullName = `${member.first_name} ${member.last_name}`;
                this.isRemoveMemberInputActive = true;
            },
            async handleRemoveMember() {
                const res = await ApiService.delete(`board/${this.$route.params.id}/member/${this.memberData.id}`);

                if (res.status === 200) {
                    await this.fetchBoardDetail();

                    this.isRemoveMemberInputActive = false;
                    this.memberData.fullName = '';
                }
            },
            async handleStoreList() {
                const res = await ApiService.post(`board/${this.$route.params.id}/list`, this.listData);

                if (res.status === 200) {
                    await this.fetchBoardDetail();

                    this.isAddListInputActive = false;
                    this.listData.name = '';
                }
            },
            async handleStoreCard(list) {
                const res = await ApiService.post(`board/${this.$route.params.id}/list/${list.id}/card`, this.cardData);

                if (res.status === 200) {
                    await this.fetchBoardDetail();

                    this.isAddCardInputActive = false;
                    this.cardData.task = '';
                }
            },
            async handleEditOrDeleteList(list, value) {
                if (value !== '') {
                    const res = await ApiService.put(`board/${this.$route.params.id}/list/${list.id}`, {
                        name: value
                    });

                    if (res.status === 200) {
                        await this.fetchBoardDetail();

                        list.isEditListInputActive = false;
                    }
                } else {
                    const res = await ApiService.delete(`board/${this.$route.params.id}/list/${list.id}`);

                    if (res.status === 200) {
                        await this.fetchBoardDetail();
                    }
                }
            },
            async handleMoveListToRight(list) {
                const res = await ApiService.post(`board/${this.$route.params.id}/list/${list.id}/right`);

                if (res.status === 200) {
                    await this.fetchBoardDetail();
                }
            },
            async handleMoveListToLeft(list) {
                const res = await ApiService.post(`board/${this.$route.params.id}/list/${list.id}/left`);

                if (res.status === 200) {
                    await this.fetchBoardDetail();
                }
            },
            async handleUpdateOrDeleteCard(list, card, value) {
                if (value !== '') {
                    const res = await ApiService.put(`board/${this.$route.params.id}/list/${list.id}/card/${card.card_id}`, {
                        task: value
                    });

                    if (res.status === 200) {
                        await this.fetchBoardDetail();

                        card.isEditCardInputActive = false;
                    }
                } else {
                    const res = await ApiService.delete(`board/${this.$route.params.id}/list/${list.id}/card/${card.card_id}`);

                    if (res.status === 200) {
                        await this.fetchBoardDetail();
                    }
                }
            },
            async handleMoveCardToDown(card) {
                const res = await ApiService.post(`card/${card.card_id}/down`);

                if (res.status === 200) {
                    await this.fetchBoardDetail();
                }
            },
            async handleMoveCardToUp(card) {
                const res = await ApiService.post(`card/${card.card_id}/up`);

                if (res.status === 200) {
                    await this.fetchBoardDetail();
                }
            },
            handleClickCard(card) {
                card.isEditCardInputActive = true;
                this.isCardOnEdit = true;
                this.cardData.id = card.card_id;
            },
            async handleMoveCardToList(list) {
                if (this.cardData.id !== '') {
                    const res = await ApiService.post(`card/${this.cardData.id}/move/${list.id}`);

                    if (res.status === 200) {
                        this.isCardOnEdit = false;
                        this.cardData.id = '';

                        await this.fetchBoardDetail();
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .container {
        position: absolute;
        height: 90vh;
        width: 100vw;
    }

    .team-container {
        margin-left: 1em;
        margin-right: 1em;
        margin-top: 1em;
    }

    .team-container div {
        display: inline-block;
    }

    .team-container .board-name {
        margin-right: 1em;
        font-weight: bold;
        font-size: 1.2em;
    }

    .team-container .member {
        background: #aee7e8;
        font-weight: bold;
        color: #111;
        margin-left: -0.7em;
        border: 1px solid #ffe;
        border-radius: 50%;
        padding: 0.3em;
        cursor: pointer;
    }

    .team-container .member:hover {
        box-shadow: inset 0 0 0 20px rgba(0, 0, 0, 0.3);
    }

    .team-container .button {
        padding: 0.3em 0.5em;
        border-radius: 5px;
        cursor: pointer;
    }

    .card-container {
        margin-left: 1em;
        margin-right: 1em;
        margin-top: 1em;
    }

    .content {
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        height: 80vh;
        display: flex;
        align-items: flex-start;
    }

    .list {
        word-wrap: break-word;
        white-space: normal;
        display: inline-block;
        min-width: 272px;
        padding: 0.5em;
        margin-right: 0.7em;
        background: #28c3d4;
        border-radius: 3px;
        color: #ffe;
        box-shadow: inset 0 0 0 100vh rgba(0, 0, 0, 0.2);
    }

    .list > :last-child {
        margin-right: 0 !important;
    }

    .list header {
        font-size: 1.2em;
        font-weight: bold;
        padding-left: 0.5em;
    }

    .list header:hover {
        color: #248ea9;
        cursor: pointer;
    }

    .list .cards {
        margin-top: 0.5em;
        max-height: 55vh;
        overflow-y: auto;
        padding: 0.2em;
    }

    .list .card {
        display: flex;
        margin: 0.5em 0;
        background: #ffe;
        border-radius: 3px;
        color: #111;
    }

    .list .card .card-content {
        padding: 0.5em;
        flex: 6;
    }

    .list .card-content:hover {
        box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    .list .card .control {
        display: flex;
        justify-content: flex-end;
        flex-grow: 1;
        flex: 1;
        margin-right: 5px;
    }

    .list .card .control span {
        font-size: 1.5em;
        padding: 2px;
        margin: 0px;
        white-space: nowrap;
    }

    .list .card .control span:hover, .list > .control span:hover {
        color: #248ea9;
        cursor: pointer;
    }

    .list > .control {
        margin-top: -5px;
        text-align: center;
    }

    .list > .control span {
        font-size: 2em;
        font-weight: bold;
    }

    .list .button {
        margin-top: 0.2em;
        padding: 5px;
        border-radius: 3px;
    }

    .button {
        background: #28c3d4;
        color: #fafdcb;
        box-shadow: inset 0 0 0 272px rgba(0, 0, 0, 0.4);
        color: #ffe;
        cursor: pointer;
    }

    .button:hover {
        box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.6);
    }

    .list input, .card input {
        width: 80%;
    }

    .card-on-edit .list header:after {
        content: "(click here to move card)";
        font-size: 0.8em;
    }
</style>