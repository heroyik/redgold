export type AppLanguage = 'en' | 'ko' | 'ja';

type LocalizedText = Partial<Record<Exclude<AppLanguage, 'en'>, string>>;

type LocalizedLine = {
  translation?: LocalizedText;
};

type LessonTranslationPack = {
  vocabulary?: Record<string, LocalizedText>;
  properNouns?: Record<string, LocalizedText>;
  grammar?: Record<string, {
    formal_translation?: LocalizedText;
    colloquial_translation?: LocalizedText;
  }>;
  keySentences?: Record<string, {
    translation?: LocalizedText;
    colloquial_translation?: LocalizedText;
    context?: LocalizedText;
  }>;
  texts?: Record<number, {
    lines?: Record<number, LocalizedLine>;
  }>;
};

const lessonTranslations: Record<number, LessonTranslationPack> = {
  1: {
    vocabulary: {
      '法律': { ko: '법률', ja: '法律' },
      '俩': { ko: '둘, 두 사람', ja: '二人、両方' },
      '印象': { ko: '인상', ja: '印象' },
      '深': { ko: '깊다', ja: '深い' },
      '熟悉': { ko: '익숙하다, 잘 알다', ja: '慣れている、よく知っている' },
      '不仅': { ko: '~뿐만 아니라', ja: '〜だけでなく' },
      '性格': { ko: '성격', ja: '性格' },
      '开玩笑': { ko: '농담하다', ja: '冗談を言う' },
      '从来': { ko: '여태, 줄곧', ja: 'これまでずっと' },
      '最好': { ko: '~하는 게 가장 좋다', ja: '〜したほうがよい' },
      '共同': { ko: '공통의, 함께하는', ja: '共通の、共同の' },
      '适合': { ko: '잘 맞다, 적합하다', ja: '合う、ふさわしい' },
      '生活': { ko: '생활; 살아가다', ja: '生活; 暮らす' },
      '刚': { ko: '막, 방금', ja: 'ちょうど、〜したばかり' },
      '浪漫': { ko: '낭만적이다', ja: 'ロマンチックだ' },
      '够': { ko: '충분하다', ja: '十分である' },
      '缺点': { ko: '단점', ja: '短所' },
      '接受': { ko: '받아들이다', ja: '受け入れる' },
      '羡慕': { ko: '부러워하다', ja: 'うらやましがる' },
      '爱情': { ko: '사랑', ja: '恋愛、愛情' },
      '星星': { ko: '별', ja: '星' },
      '即使': { ko: '설령 ~하더라도', ja: 'たとえ〜でも' },
      '加班': { ko: '야근하다', ja: '残業する' },
      '亮': { ko: '밝다, 불이 켜져 있다', ja: '明るい、灯りがついている' },
      '感动': { ko: '감동시키다, 감동하다', ja: '感動させる、心を動かす' },
      '自然': { ko: '자연히, 당연히', ja: '自然に、当然' },
      '原因': { ko: '이유', ja: '理由' },
      '互相': { ko: '서로', ja: '互いに' },
      '吸引': { ko: '끌어당기다', ja: '引きつける' },
      '幽默': { ko: '유머러스하다', ja: 'ユーモアがある' },
      '脾气': { ko: '성미, 성격', ja: '気質、気性' }
    },
    properNouns: {
      '孙月': { ko: '인명: 쑨웨', ja: '人名: 孫月' },
      '王静': { ko: '인명: 왕징', ja: '人名: 王静' },
      '李进': { ko: '인명: 리진', ja: '人名: 李進' },
      '李': { ko: '중국의 성씨 리', ja: '中国の姓「李」' },
      '高': { ko: '중국의 성씨 가오', ja: '中国の姓「高」' }
    },
    grammar: {
      '不仅……也/还/而且……': {
        formal_translation: {
          ko: '그는 축구도 잘할 뿐만 아니라 성격도 좋다.',
          ja: '彼はサッカーが上手なだけでなく、性格もよい。'
        },
        colloquial_translation: {
          ko: '얘는 축구만 잘하는 게 아니라 사람도 정말 괜찮아.',
          ja: 'こいつ、サッカーがうまいだけじゃなくて人柄もかなりいい。'
        }
      },
      '从来': {
        formal_translation: {
          ko: '우리가 알게 된 지는 오래되지 않았지만, 나는 이렇게 행복해 본 적이 없다.',
          ja: '知り合ってまだ長くないが、こんなに幸せだったことはない。'
        },
        colloquial_translation: {
          ko: '그를 알고 난 뒤로 이렇게까지 행복했던 적은 진짜 한 번도 없어.',
          ja: '彼と知り合ってから、こんなに幸せだったことはマジで一度もない。'
        }
      },
      '刚 vs 刚才': {
        formal_translation: {
          ko: '남편과 막 결혼했을 때는 매일이 다 새롭게 느껴졌다.',
          ja: '夫と結婚したばかりのころは、毎日がとても新鮮に感じられた。'
        },
        colloquial_translation: {
          ko: '우리 남편이랑 막 결혼했을 땐 눈만 뜨면 다 새롭게 느껴졌어.',
          ja: '夫と結婚したばかりのころは、目が覚めるたびに全部が新鮮だった。'
        }
      },
      '即使……也……': {
        formal_translation: {
          ko: '매일 너무 바빠 쉴 시간이 없더라도 그는 여전히 행복하다고 느낀다.',
          ja: '毎日忙しすぎて休む時間がなくても、彼はやはり幸せだと感じている。'
        },
        colloquial_translation: {
          ko: '아무리 일이 미친 듯이 많아도 그는 그 나름대로 즐기고 있어.',
          ja: 'どれだけ仕事に追われても、彼はなんだかんだ楽しんでいる。'
        }
      },
      '（在）……上': {
        formal_translation: {
          ko: '성격 면에서 보면 그는 축구도 잘하고 성격도 좋다.',
          ja: '性格の面で言えば、彼はサッカーも上手だし性格もよい。'
        },
        colloquial_translation: {
          ko: '성격 얘기로 하면 얘 진짜 의리 있고 축구도 엄청 잘해.',
          ja: '性格って面で言えば、こいつは義理堅いしサッカーもうまい。'
        }
      }
    },
    keySentences: {
      '虽然我们认识的时间不长，但我<b>从来没</b>这么快乐过。': {
        translation: {
          ko: '우리가 알게 된 지는 오래되지 않았지만, 나는 이렇게 행복했던 적이 없다.',
          ja: '知り合ってまだ長くないけれど、こんなに幸せだったことはない。'
        },
        colloquial_translation: {
          ko: '알게 된 지 얼마 안 됐는데도 이렇게 행복한 건 처음이야.',
          ja: '知り合ってまだそんなに経ってないのに、こんなに幸せなのは初めてだ。'
        },
        context: {
          ko: '새로운 연애에서 느끼는 큰 행복을 표현할 때.',
          ja: '新しい恋愛で感じる大きな幸福を表すとき。'
        }
      },
      '两个人共同生活，只有浪漫和新鲜感是不够的。': {
        translation: {
          ko: '두 사람이 함께 살아가려면 낭만과 설렘만으로는 부족하다.',
          ja: '二人で暮らしていくには、ロマンや新鮮さだけでは足りない。'
        },
        colloquial_translation: {
          ko: '같이 살다 보면 낭만이랑 설렘만으론 절대 안 돼.',
          ja: '一緒に暮らすなら、ロマンとときめきだけじゃやっていけない。'
        },
        context: {
          ko: '장기적인 관계에 대한 현실적인 조언을 할 때.',
          ja: '長い関係について現実的な助言をするとき。'
        }
      },
      '我能想到最浪漫的事，就是和你一起慢慢变老。': {
        translation: {
          ko: '내가 생각할 수 있는 가장 낭만적인 일은 너와 함께 천천히 늙어 가는 것이다.',
          ja: '私が思ういちばんロマンチックなことは、あなたと一緒にゆっくり年を重ねることだ。'
        },
        colloquial_translation: {
          ko: '평생 너랑 같이 늙어 갈 수 있으면 그걸로 충분해.',
          ja: '一生あなたと一緒に年を取れたら、それで十分だ。'
        },
        context: {
          ko: '깊고 오래가는 사랑을 표현할 때.',
          ja: '深く長く続く愛を表すとき。'
        }
      },
      '其实，让我们感动的，就是生活中简单的爱情。': {
        translation: {
          ko: '사실 우리를 감동시키는 것은 삶 속의 소박한 사랑이다.',
          ja: '実は、私たちの心を動かすのは暮らしの中の素朴な愛だ。'
        },
        colloquial_translation: {
          ko: '결국 사람 마음을 움직이는 건 소소하고 담백한 사랑이야.',
          ja: '結局いちばん心に響くのは、ささやかで穏やかな愛なんだ。'
        },
        context: {
          ko: '평범한 사랑의 아름다움을 돌아볼 때.',
          ja: '何気ない愛の美しさを振り返るとき。'
        }
      }
    },
    texts: {
      1: {
        lines: {
          0: {
            translation: {
              ko: '네 남자친구 리진이 너랑 같은 학교라던데, 네 동창이야?',
              ja: 'あなたの彼氏の李進って、あなたと同じ学校なんでしょう？同級生なの？'
            }
          },
          1: {
            translation: {
              ko: '응, 그는 신문학을 전공하고 나는 법을 전공해. 그래서 같은 반은 아니야.',
              ja: 'うん、彼は新聞学で私は法律を専攻しているの。同じクラスではないよ。'
            }
          },
          2: {
            translation: {
              ko: '그럼 너희 둘은 어떻게 알게 된 거야?',
              ja: 'じゃあ、二人はどうやって知り合ったの？'
            }
          },
          3: {
            translation: {
              ko: '우리는 축구 경기에서 알게 됐어. 우리 반이 그들 반과 시합했는데, 그가 혼자 두 골을 넣어서 인상이 아주 깊었고, 그 뒤로 천천히 친해졌어.',
              ja: '私たちはサッカーの試合で知り合ったの。うちのクラスが彼らのクラスと試合をして、彼が一人で二点入れたからすごく印象に残って、そのあと少しずつ親しくなったの。'
            }
          },
          4: {
            translation: {
              ko: '너는 왜 그를 좋아해?',
              ja: 'どうして彼のことが好きなの？'
            }
          },
          5: {
            translation: {
              ko: '그는 축구도 잘할 뿐만 아니라 성격도 좋아.',
              ja: '彼はサッカーが上手なだけでなく、性格もいいの。'
            }
          }
        }
      },
      2: {
        lines: {
          0: {
            translation: {
              ko: '이 선생님, 저 다음 달 5일에 결혼해요.',
              ja: '李先生、私、来月5日に結婚するんです。'
            }
          },
          1: {
            translation: {
              ko: '농담하는 거니? 너희 아직 안 지 한 달밖에 안 됐잖아?',
              ja: '冗談でしょう？あなたたち、知り合ってまだ一か月しか経っていないでしょう？'
            }
          },
          2: {
            translation: {
              ko: '우리가 알게 된 지는 오래되지 않았지만, 저는 이렇게 행복했던 적이 없어요.',
              ja: '知り合ってまだ長くはありませんが、こんなに幸せだったことはありません。'
            }
          },
          3: {
            translation: {
              ko: '두 사람이 함께하려면 공통의 관심사와 취미가 있는 게 가장 좋단다.',
              ja: '二人が一緒にいるなら、共通の興味や趣味があるのがいちばんいいよ。'
            }
          },
          4: {
            translation: {
              ko: '저희는 공통 취미가 정말 많아요. 자주 같이 공도 치고, 노래도 하고, 요리도 해요.',
              ja: '私たちは共通の趣味がたくさんあります。よく一緒に球技をしたり、歌ったり、料理したりします。'
            }
          },
          5: {
            translation: {
              ko: '정말 너에게 잘 맞는 사람을 찾은 것 같구나. 행복하길 바란다!',
              ja: '本当にあなたに合う人を見つけたみたいだね。幸せを祈っているよ。'
            }
          }
        }
      },
      3: {
        lines: {
          0: {
            translation: {
              ko: '선생님은 사모님과 결혼하신 지 거의 20년 되셨다면서요?',
              ja: '先生は奥さまと結婚してもうすぐ20年になるそうですね？'
            }
          },
          1: {
            translation: {
              ko: '6월 9일이 되면 저희는 결혼 20주년이 됩니다. 이렇게 오랜 세월 동안 우리 생활은 늘 꽤 행복했어요.',
              ja: '6月9日になれば、私たちは結婚20周年になります。これまでずっと、私たちの暮らしはかなり幸せでした。'
            }
          },
          2: {
            translation: {
              ko: '저도 남편과 막 결혼했을 때는 매일이 참 새로웠고, 함께 있으면 끝도 없이 할 말이 있었어요. 그런데 지금은……',
              ja: '私も夫と結婚したばかりのころは毎日が新鮮で、一緒にいると話が尽きませんでした。でも今は……'
            }
          },
          3: {
            translation: {
              ko: '두 사람이 함께 살아가려면 낭만과 신선함만으로는 부족합니다.',
              ja: '二人で生活するには、ロマンや新鮮さだけでは足りません。'
            }
          },
          4: {
            translation: {
              ko: '맞는 말씀이에요! 요즘은 매일 그의 단점만 보여요.',
              ja: 'おっしゃる通りです！今は毎日、彼の短所ばかりが目につきます。'
            }
          },
          5: {
            translation: {
              ko: '두 사람이 함께 있는 시간이 길어지면 많은 문제가 생기게 됩니다. 그의 단점을 받아들여야 더 잘 함께 살아갈 수 있어요.',
              ja: '二人が一緒にいる時間が長くなると、いろいろな問題が出てきます。彼の短所を受け入れてこそ、もっとよく一緒に暮らしていけるのです。'
            }
          }
        }
      },
      4: {
        lines: {
          0: {
            translation: {
              ko: '많은 여자아이들이 낭만적인 사랑을 부러워한다. 그렇다면 낭만이란 무엇일까? 젊은 사람들은 말한다. 그녀가 달을 원할 때 별을 주지 않는 것이 낭만이라고. 중년의 사람들은 말한다. 밤늦게 야근해 자정이 되어 집에 돌아와도 집 안에 여전히 불이 켜져 있는 것이 낭만이라고. 노년의 사람들은 말한다. 낭만은 사실 노래 가사처럼 “내가 생각할 수 있는 가장 낭만적인 일은 너와 함께 천천히 늙어 가는 것”이라고. 사실 우리를 감동시키는 것은 삶 속의 소박한 사랑이다. 때로는 단순함이 가장 큰 행복이다.',
              ja: '多くの女の子はロマンチックな愛に憧れる。では、ロマンとは何だろうか。若い人は、彼女が月を欲しがるときに星をあげないことだと言う。中年の人は、夜遅くまで残業して零時に帰宅しても、家の灯りがまだついていることだと言う。年配の人は、ロマンとは歌にあるように「私が思ういちばんロマンチックなことは、あなたと一緒にゆっくり年を重ねること」だと言う。実は、私たちの心を動かすのは暮らしの中の素朴な愛だ。時には、シンプルであることこそが最大の幸せなのだ。'
            }
          }
        }
      },
      5: {
        lines: {
          0: {
            translation: {
              ko: '결혼 이야기가 나오면 사람들은 자연스럽게 사랑을 떠올리게 된다. 사랑은 결혼의 중요한 이유이지만, 두 사람이 함께 살아가려면 낭만적인 사랑만 필요한 것이 아니라 성격 면에서도 서로 끌려야 한다. 내 남편은 아주 유머 있는 사람이다. 아주 평범한 일도 그의 입에서 나오면 재미있어진다. 내가 힘들 때 그는 늘 나를 기쁘게 할 방법을 찾아낸다. 게다가 성미도 좋다. 결혼한 지 거의 10년이 되었지만 우리는 거의 어떤 일로도 얼굴을 붉힌 적이 없어서 많은 사람들이 특히 우리를 부러워한다.',
              ja: '結婚の話になると、人は自然に愛情を思い浮かべる。愛情は結婚の大切な理由だが、二人が一緒に生活するにはロマンチックな愛だけでなく、性格の面でも互いに引かれ合うことが必要だ。私の夫はとてもユーモアのある人で、ごく普通のことでも彼の口から出ると面白くなる。私がつらいとき、彼はいつも私を元気にする方法を見つけてくれる。そのうえ気性もよく、結婚してもうすぐ10年になるが、私たちはほとんど何かで顔を赤くして言い争ったことがない。だから多くの人がとくに私たちをうらやましがる。'
            }
          }
        }
      }
    }
  }
};

function pickLocalized(baseValue: string | undefined, localized: LocalizedText | undefined, language: AppLanguage) {
  if (language === 'en') return baseValue;
  return localized?.[language] ?? baseValue;
}

export function translateLessonData<T extends {
  vocabulary?: any[];
  grammar?: any[];
  key_sentences?: any[];
  texts?: any[];
}>(lessonId: number, lessonData: T, language: AppLanguage): T {
  if (language === 'en') return lessonData;

  const pack = lessonTranslations[lessonId];
  if (!pack) return lessonData;

  return {
    ...lessonData,
    vocabulary: lessonData.vocabulary?.map((item: any) => ({
      ...item,
      meaning: pickLocalized(item.meaning, pack.vocabulary?.[item.word], language) ?? item.meaning
    })),
    grammar: lessonData.grammar?.map((item: any) => ({
      ...item,
      formal_translation: pickLocalized(item.formal_translation, pack.grammar?.[item.point]?.formal_translation, language) ?? item.formal_translation,
      colloquial_translation: pickLocalized(item.colloquial_translation, pack.grammar?.[item.point]?.colloquial_translation, language) ?? item.colloquial_translation
    })),
    key_sentences: lessonData.key_sentences?.map((item: any) => ({
      ...item,
      translation: pickLocalized(item.translation, pack.keySentences?.[item.sentence]?.translation, language) ?? item.translation,
      colloquial_translation: pickLocalized(item.colloquial_translation, pack.keySentences?.[item.sentence]?.colloquial_translation, language) ?? item.colloquial_translation,
      context: pickLocalized(item.context, pack.keySentences?.[item.sentence]?.context, language) ?? item.context
    })),
    texts: lessonData.texts?.map((text: any) => ({
      ...text,
      content: text.content?.map((line: any, index: number) => ({
        ...line,
        translation: pickLocalized(line.translation, pack.texts?.[text.id]?.lines?.[index]?.translation, language) ?? line.translation
      })),
      vocabulary: text.vocabulary?.map((item: any) => ({
        ...item,
        meaning: pickLocalized(item.meaning, pack.vocabulary?.[item.word], language) ?? item.meaning
      })),
      proper_nouns: text.proper_nouns?.map((item: any) => ({
        ...item,
        meaning: pickLocalized(item.meaning, pack.properNouns?.[item.word], language) ?? item.meaning
      }))
    }))
  };
}
